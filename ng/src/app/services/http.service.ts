import { ConfigurationService } from './configuration.service';
import { ConnectionData } from './../model/connection';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";



@Injectable({
    providedIn: 'root'
})
export class HttpService {

    endpoint: string;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) {
        this.endpoint = this.configurationService.params.server;
    }

    public getAllList(): Observable<ConnectionData[]>  { 
        return this.http.get<ConnectionData[]>(this.endpoint + "/list");       
     }
    
    
    
    public addRecord(recordData : any): Observable<any>  { 
        return this.http.post(this.endpoint + "/add", recordData);       
     }

    public updateRecord(recordData : any): Observable<any>  { 
        return this.http.post(this.endpoint + "/update", recordData);       
     }

     public deleteRecord(recordData : any): Observable<any>  { 
        return this.http.post(this.endpoint + "/delete", recordData);       
     }

    public connect(recordData : any): Observable<any>  { 
        let emitterIdValue = this.configurationService.getEmitterId();        
        return this.http.post(this.endpoint + "/connect?emitterId=" + emitterIdValue, recordData);       
     }

     public disconnect(recordData : any): Observable<any>  { 
        let emitterIdValue = this.configurationService.getEmitterId();        
        return this.http.post(this.endpoint + "/disconnect?emitterId=" + emitterIdValue, recordData);       
     }

}
