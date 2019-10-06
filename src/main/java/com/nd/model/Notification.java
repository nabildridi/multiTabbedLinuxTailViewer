package com.nd.model;

import org.springframework.context.ApplicationEvent;

import com.nd.enums.MessageType;

public class Notification extends ApplicationEvent{
	
	public Notification(Object source) {
		super(source);
		// TODO Auto-generated constructor stub
	}

	private MessageType type;
	private String connectionId;	
	private String payload;

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}

	public String getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(String connectionId) {
		this.connectionId = connectionId;
	}

	public MessageType getType() {
		return type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}

	

	
}
