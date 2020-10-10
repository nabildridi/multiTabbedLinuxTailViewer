package com.nd.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.nd.services.ConnectionService;

@CrossOrigin( origins = "*" )
@RestController
public class NotificationController {
	
	private static Logger logger = LoggerFactory.getLogger(NotificationController.class);

	@Autowired
	private ConnectionService connectionService;

	@RequestMapping(value = "/subscribe", method = RequestMethod.GET)
	public SseEmitter subscribe(@RequestParam(name = "emitterId") String emitterId) {			

		SseEmitter emitter = new SseEmitter(14400000L);
		connectionService.storeNewEmitter(emitterId, emitter);
		return emitter;
		
	}
	

}
