package com.nd.threads;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.nd.enums.MessageType;
import com.nd.model.Notification;

import io.vavr.Tuple3;

@Service
public class BroadCaster implements ApplicationListener<Notification> {

	private static Logger logger = LoggerFactory.getLogger(BroadCaster.class);
	
	@Autowired
	private Map<String, SseEmitter> emitters;
	
	@Autowired
	private CopyOnWriteArrayList<Tuple3<String, SshConnection, Set<String>>> sshConnections;


	@Override
	public void onApplicationEvent(Notification notification) {

		try {
			
			//notif is a hearbeat, send to all
			if(notification.getType() == MessageType.HeartBeat) {
				
				emitters.forEach((k, v) -> {						
					
					try {
						v.send(notification, MediaType.APPLICATION_JSON);
					} catch (Exception e) {}
					
				});
			
				//notif is a message or error
			}else {
				
				String sshConnectionId = notification.getConnectionId();					

		    	Tuple3<String, SshConnection, Set<String>> connectionTuple = sshConnections.stream()
		                .filter(x -> sshConnectionId.equals(x._1))
		                .findAny()
		                .orElse(null);
		    	
		    	if(connectionTuple != null) {
		    		connectionTuple._3.forEach(emitterId -> {

		    			try {
							emitters.get(emitterId).send(notification, MediaType.APPLICATION_JSON);
						}catch (Exception e) {}
						
		    		});
		    	}

				
			}
			
			
		} catch (Exception e) {}
		
	}

	

}
