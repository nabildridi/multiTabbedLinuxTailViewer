import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { ConfigurationService } from "src/app/services/configuration.service";
import { ConnectionData } from "src/app/model/connection";

@Injectable({
    providedIn: 'root'
  })
export class HttpCallsService{
    
    constructor(private http: HttpClient,private configurationService : ConfigurationService) {}   

    public getAllList(): Observable<ConnectionData[]>  { 
        let endpoint = this.configurationService.get("server");
        return this.http.get<ConnectionData[]>(endpoint + "/list");       
     }
    
    
    
    public addRecord(recordData : any): Observable<any>  { 
        let endpoint = this.configurationService.get("server");
        
        return this.http.post(endpoint + "/add", recordData);       
     }

    public updateRecord(recordData : any): Observable<any>  { 
        let endpoint = this.configurationService.get("server");
        
        return this.http.post(endpoint + "/update", recordData);       
     }

     public deleteRecord(recordData : any): Observable<any>  { 
        let endpoint = this.configurationService.get("server");
        
        return this.http.post(endpoint + "/delete", recordData);       
     }

    public connect(recordData : any): Observable<any>  { 
        let endpoint = this.configurationService.get("server");
        let emitterIdValue = this.configurationService.getEmitterId();
        
        return this.http.post(endpoint + "/connect?emitterId=" + emitterIdValue, recordData);       
     }

     public disconnect(recordData : any): Observable<any>  { 
        let endpoint = this.configurationService.get("server");
        let emitterIdValue = this.configurationService.getEmitterId();
        
        return this.http.post(endpoint + "/disconnect?emitterId=" + emitterIdValue, recordData);       
     }

}