package com.nd.model;

import java.io.Serializable;

import org.dizitart.no2.objects.Id;

public class TailRecord implements Serializable {
		
	@Id
	private String id;	
	
	private String name;
	
	private String host;
	private int port;
	private String username;
	private String password;
	private String sudoPwd;
	private String filePath;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getSudoPwd() {
		return sudoPwd;
	}
	public void setSudoPwd(String sudoPwd) {
		this.sudoPwd = sudoPwd;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}    
    
	
    
}
