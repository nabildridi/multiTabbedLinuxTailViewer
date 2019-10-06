package com.nd.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

import org.apache.sshd.client.ClientFactoryManager;
import org.apache.sshd.client.SshClient;
import org.apache.sshd.common.PropertyResolverUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.nd.enums.MessageType;
import com.nd.model.Notification;
import com.nd.threads.SshConnection;

import io.vavr.Tuple3;

@Configuration
public class AppBeans {
     
	
    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor pool = new ThreadPoolTaskExecutor();
        pool.setCorePoolSize(10);
        pool.setMaxPoolSize(100);
        pool.setWaitForTasksToCompleteOnShutdown(true);
        pool.initialize();
        return pool;
    }
    
    @Bean
    public SshClient sshClient() {
    	SshClient sshClient = SshClient.setUpDefaultClient();
		PropertyResolverUtils.updateProperty(sshClient, ClientFactoryManager.HEARTBEAT_INTERVAL, TimeUnit.MINUTES.toMillis(30));
		PropertyResolverUtils.updateProperty(sshClient, ClientFactoryManager.IDLE_TIMEOUT, TimeUnit.MINUTES.toMillis(30));
		sshClient.start();
        return sshClient;
    } 
    
    @Bean
    public Notification heartBeat() {
    	Notification heartBeat = new Notification("");
		heartBeat.setType(MessageType.HeartBeat);
		heartBeat.setConnectionId(null);
		heartBeat.setPayload(null);		
        return heartBeat;
    } 

    @Bean
    public Map<String, SseEmitter> emitters() {
    	Map<String, SseEmitter> emitters = new HashMap<>();
        return emitters;
    } 

    @Bean
    public CopyOnWriteArrayList<Tuple3<String, SshConnection, Set<String>>> sshConnections() {
    	CopyOnWriteArrayList<Tuple3<String, SshConnection, Set<String>>> sshConnections  = new CopyOnWriteArrayList<>();
        return sshConnections;
    } 
}