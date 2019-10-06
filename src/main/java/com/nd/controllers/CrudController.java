package com.nd.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nd.model.TailRecord;
import com.nd.services.ConnectionService;
import com.nd.services.StorageService;

@CrossOrigin( origins = "*" )
@RestController
public class CrudController {
	
	private static Logger logger = LoggerFactory.getLogger(CrudController.class);

	
	@Autowired
	private StorageService storageService;

	@Autowired
	private ConnectionService connectionService;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public ResponseEntity<List<TailRecord>> getAll() {			
		
		List<TailRecord> response = storageService.getAll();		
		return ResponseEntity.ok(response);
	}

	
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public ResponseEntity<?> add(@RequestBody TailRecord record) {			
		
		Map<String, Object> response = new HashMap<>();			
		boolean result = storageService.add(record);		
		response.put("error", result);		
		return ResponseEntity.ok(response);
	}

	
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResponseEntity<?> update(@RequestBody TailRecord record) {			
		
		Map<String, Object> response = new HashMap<>();			
		boolean result = storageService.update(record);		
		response.put("error", result);		
		return ResponseEntity.ok(response);
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public ResponseEntity<?> delete(@RequestBody TailRecord record) {			
		
		Map<String, Object> response = new HashMap<>();			
		boolean result = storageService.delete(record);		
		response.put("error", result);		
		return ResponseEntity.ok(response);
	}
	
	@RequestMapping(value = "/connect", method = RequestMethod.POST)
	public ResponseEntity<?> connect(@RequestBody TailRecord record, @RequestParam(name = "emitterId") String emitterId) {			

		Map<String, Object> response = new HashMap<>();			
		boolean result = connectionService.connectOrJoint(record, emitterId);		
		response.put("error", result);		
		return ResponseEntity.ok(response);
	}
	
	@RequestMapping(value = "/disconnect", method = RequestMethod.POST)
	public ResponseEntity<?> disconnect(@RequestBody TailRecord record, @RequestParam(name = "emitterId") String emitterId) {			

		Map<String, Object> response = new HashMap<>();			
		boolean result = connectionService.disconnect(record, emitterId);		
		response.put("error", result);		
		return ResponseEntity.ok(response);
	}

}
