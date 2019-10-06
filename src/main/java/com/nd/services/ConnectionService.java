package com.nd.services;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import javax.annotation.PreDestroy;

import org.apache.sshd.client.SshClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.nd.model.Notification;
import com.nd.model.TailRecord;
import com.nd.threads.SshConnection;

import io.vavr.Tuple;
import io.vavr.Tuple3;

@Service
public class ConnectionService{	
	
	private final Logger logger = LoggerFactory.getLogger(ConnectionService.class);
	
	@Autowired
    private ThreadPoolTaskExecutor threadPool;	
	
	@Autowired
	private SshClient sshClient;	
	
	@Autowired
	private Notification heartBeat;
	
	@Autowired
    private ApplicationEventPublisher applicationEventPublisher;	
	
	@Autowired
	private Map<String, SseEmitter> emitters;
	
	@Autowired
	private CopyOnWriteArrayList<Tuple3<String, SshConnection, Set<String>>> sshConnections;
	
	
	public void storeNewEmitter(String emitterId, SseEmitter emitter) {

		emitters.put(emitterId, emitter);		
		
		emitter.onCompletion(() -> {
			
			String result = emitters.entrySet().stream()
					.filter(x -> emitter == x.getValue())
					.map(x -> x.getKey())
					.collect(Collectors.joining());
			
			if(result != null) {					
				removeEmitterFromConnections(result);
			}
			
			emitters.entrySet().removeIf(e -> (e.getValue() == emitter));
		});
		
		
		emitter.onTimeout(() -> {

			String result = emitters.entrySet().stream()
					.filter(x -> emitter == x.getValue())
					.map(x -> x.getKey())
					.collect(Collectors.joining());
			
			if(result != null) {					
				removeEmitterFromConnections(result);
			}
			
			emitters.entrySet().removeIf(e -> (e.getValue() == emitter));

		});
		
	}
	
    public boolean connectOrJoint(TailRecord record, String emitterId) {
		
    	String sshConnectionId = record.getId();
    	
    	Tuple3<String, SshConnection, Set<String>> connectionTuple = sshConnections.stream()
                .filter(x -> sshConnectionId.equals(x._1))
                .findAny()
                .orElse(null);
    	
    	if(connectionTuple == null) {
    		SshConnection sshConnection = new SshConnection(record, applicationEventPublisher, sshClient);
    		threadPool.execute(sshConnection);    		
    		connectionTuple = Tuple.of(sshConnectionId, sshConnection, new HashSet<String>());
    		sshConnections.add(connectionTuple);
    	}
    	
    	connectionTuple._3.add(emitterId);
   	
    	return true;
    }
    
    public boolean disconnect(TailRecord record, String emitterId) {
    	
    	String sshConnectionId = record.getId();
    	
    	Tuple3<String, SshConnection, Set<String>> connectionTuple = sshConnections.stream()
                .filter(x -> sshConnectionId.equals(x._1))
                .findAny()
                .orElse(null);
    	
    	if(connectionTuple != null) {
    		connectionTuple._3.remove(emitterId);
    		
    		//if no listeners close the ssh connection
    		if(connectionTuple._3.size() == 0) {
    			//close ssh connection
    			connectionTuple._2.closeConnection();
    			
    			//remove ssh connection from the list
    			sshConnections.remove(connectionTuple);
    		}
    	}   	
    	
    	return true;
    }
    
	
	@Scheduled(fixedRate = 5000)
    public void emitHearbeat() {
		applicationEventPublisher.publishEvent(heartBeat);
    }
	
	@PreDestroy
    public void closeAll() {
		
    	sshConnections.forEach(connectionTuple->{    		
   			connectionTuple._2.closeConnection();   		
    	});
		
		try {
			sshClient.close();
		} catch (IOException e) {}
    }
	
	
    public void removeEmitterFromConnections(String emitterId) {
    	
    	sshConnections.forEach(connectionTuple->{
    		
    		connectionTuple._3.remove(emitterId);
    		
    		//if no listeners close the ssh connection
    		if(connectionTuple._3.size() == 0) {
    			//close ssh connection
    			connectionTuple._2.closeConnection();
    			
    			//remove ssh connection from the list
    			sshConnections.remove(connectionTuple);
    		}
    		
    	});
    	
    	
    	
    	
    }
	
	

}
