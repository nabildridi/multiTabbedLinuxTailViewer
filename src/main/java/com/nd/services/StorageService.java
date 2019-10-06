package com.nd.services;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.dizitart.no2.Nitrite;
import org.dizitart.no2.objects.Cursor;
import org.dizitart.no2.objects.ObjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nd.model.TailRecord;

@Service
public class StorageService {
	
	private static Logger logger = LoggerFactory.getLogger(StorageService.class);
	
	private Nitrite db;
	
	private ObjectRepository<TailRecord> repository;
	
	@PostConstruct
	private void openDatabase() {
		
		db = Nitrite.builder()
		        .compressed()
		        .filePath("tailRecords.db")
		        .openOrCreate();
		
		repository = db.getRepository(TailRecord.class);
		
	}
	
	public boolean update(TailRecord record) {
		
		try {
			repository.update(record);
			return true;
		} catch (Exception e1) {return false;}
			  
		
	}

	
	public List<TailRecord> getAll() {		
		Cursor<TailRecord> cursor = repository.find();
		return cursor.toList();
	}

	public boolean add(TailRecord record) {		

		record.setId(String.valueOf(System.currentTimeMillis()));		
		try {
			repository.insert(record);
			return true;
		} catch (Exception e) {
			return false;
		}		
		
	}

	
	public boolean delete(TailRecord record) {		
		
		
		if(record != null) {
			repository.remove(record);
			return true;
		}	
		
		return false;
		
	}
	
	@PreDestroy
	private void close() {
		db.close();
	}

	
	
}
