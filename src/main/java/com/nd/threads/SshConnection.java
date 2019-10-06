package com.nd.threads;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import org.apache.sshd.client.SshClient;
import org.apache.sshd.client.channel.ClientChannel;
import org.apache.sshd.client.future.ConnectFuture;
import org.apache.sshd.client.session.ClientSession;
import org.apache.sshd.common.future.SshFutureListener;
import org.apache.sshd.common.io.IoInputStream;
import org.apache.sshd.common.io.IoOutputStream;
import org.apache.sshd.common.io.IoReadFuture;
import org.apache.sshd.common.io.IoWriteFuture;
import org.apache.sshd.common.util.buffer.Buffer;
import org.apache.sshd.common.util.buffer.ByteArrayBuffer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.nd.enums.MessageType;
import com.nd.model.Notification;
import com.nd.model.TailRecord;

@Component
@Scope("prototype")
public class SshConnection implements Runnable {

	private static Logger logger = LoggerFactory.getLogger(SshConnection.class);

	private TailRecord record;
	private ApplicationEventPublisher applicationEventPublisher;
	private SshClient sshClient;

	private ClientSession session = null;
	private ClientChannel channel = null;
	
	private IoOutputStream asyncIn;
	private IoInputStream asyncOut;
	private IoInputStream asyncErr;


	public SshConnection(TailRecord record, ApplicationEventPublisher applicationEventPublisher, SshClient sshClient) {
		super();
		this.record = record;
		this.applicationEventPublisher = applicationEventPublisher;
		this.sshClient = sshClient;
	}

	@Override
	public void run() {
		
		//opening session
		try {			
			openSession();			
		} catch (Exception e) {	
			sendErrorMessage("Can not open an ssh session to this server");
			return;
		}		
		
		//opening a shell channel
		try {
			openChannel();
		} catch (Exception e) {
			sendErrorMessage("Can not open a shell channel to this server");
			return;
		}
		
		String sshCommand = "tail -f " + this.record.getFilePath();
		
		if(this.record.getSudoPwd() != null && !this.record.getSudoPwd().isEmpty()) {
			sshCommand = "echo " + this.record.getSudoPwd() + " | sudo -S " + sshCommand; 
		}
		
		//executing ssh command		
		asyncIn = channel.getAsyncIn();
		IoWriteFuture writeFuture = null;
		try {
			writeFuture = executeCommand(sshCommand);
		} catch (IOException e) {
			sendErrorMessage("Can not execute command :" + sshCommand);
			return;
		}
		
		writeFuture.addListener(new SshFutureListener<IoWriteFuture>() {
			@Override
			public void operationComplete(IoWriteFuture future) {
				Throwable exception = future.getException();
				
				if (exception != null) {				
					sendErrorMessage("Can not execute command");					
					return;
					
				}
			}
		});

		
		asyncOut = channel.getAsyncOut();		
		asyncOut.read(new ByteArrayBuffer(1024)).addListener(new SshFutureListener<IoReadFuture>() {
			@Override
			public void operationComplete(IoReadFuture future) {
				Buffer buffer = future.getBuffer();
				String message = new String(buffer.array(), buffer.rpos(), buffer.available(), StandardCharsets.UTF_8);
				
				Notification notification = new Notification("");
				notification.setType(MessageType.Message);
				notification.setConnectionId(record.getId());
				notification.setPayload(message);
				applicationEventPublisher.publishEvent(notification);
				
				
				buffer.rpos(buffer.rpos() + buffer.available());
				buffer.compact();

				asyncOut.read(buffer).addListener(this);
			}
		});

		asyncErr = channel.getAsyncErr();
		asyncErr.read(new ByteArrayBuffer()).addListener(new SshFutureListener<IoReadFuture>() {
			@Override
			public void operationComplete(IoReadFuture future) {

				Buffer buffer = future.getBuffer();				
				String message = new String(buffer.array(), buffer.rpos(), buffer.available(), StandardCharsets.UTF_8);

				sendErrorMessage("Error happened while receiving tail from the server, please try connecting again :" + message);				
				
				buffer.rpos(buffer.rpos() + buffer.available());
				buffer.compact(); 

				asyncErr.read(buffer).addListener(this);
			}
		});

	}

	private IoWriteFuture executeCommand(String command) throws IOException {
		command = command + "\n";		
		IoWriteFuture writeFuture = asyncIn.writePacket(new ByteArrayBuffer(command.getBytes(StandardCharsets.UTF_8)));
		return writeFuture; 		

	}

	private void openSession() throws Exception {
		ConnectFuture connectFuture = sshClient.connect(this.record.getUsername(), 
														this.record.getHost(), 
														this.record.getPort());
		connectFuture.await(10, TimeUnit.SECONDS);
		session = connectFuture.getSession();
		session.addPasswordIdentity(this.record.getPassword());
		session.auth().verify(10, TimeUnit.SECONDS);
	}

	private void openChannel() throws Exception {

		channel = session.createShellChannel();
		channel.setStreaming(ClientChannel.Streaming.Async);
		channel.open().verify(10L, TimeUnit.SECONDS);
	}
	
	private void sendErrorMessage(String errorMessage) {
		
		Notification notification = new Notification("");
		notification.setType(MessageType.Error);
		notification.setConnectionId(record.getId());
		notification.setPayload(errorMessage);
		applicationEventPublisher.publishEvent(notification);
		
	}

	public void closeConnection() {
		logger.debug("Closing connection...");
		
		try {
			asyncIn.close();
		} catch (Exception e1) {}
		
		try {
			asyncOut.close();
		} catch (Exception e1) {}
		
		try {
			asyncErr.close();
		} catch (Exception e1) {}
		
		try {
			channel.close();
		} catch (Exception e) {}


		try {
			session.close();
		} catch (Exception e) {}


	}

}
