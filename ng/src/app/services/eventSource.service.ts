import { ConfigurationService } from './configuration.service';
import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {EventSourcePolyfill} from 'ng-event-source';

@Injectable({
    providedIn: 'root'
  })
export class EventSourceService{ 
  
  es : any;
  subject = new Subject<any>();
  endpoint : string;  

  private readonly SERVER_UPDATES_MAPPING: string = "/rest/subscribe/Web";
    
  constructor(private zone: NgZone, private configurationService: ConfigurationService) {
    this.endpoint = this.configurationService.params.server;
}

 

  public getRemoteUpdates(){
        this.configurationService.generateEmitterId();
        let emitterIdValue = this.configurationService.getEmitterId();
        this.closeEventSource();

        this.es = new EventSourcePolyfill(this.endpoint+ "/subscribe?emitterId=" + emitterIdValue, {});
        this.es.onmessage = evt => {
        
          this.zone.run(() => {
              let sseMessage = JSON.parse(evt.data);
              this.broadcastSse(sseMessage);
          });
          
          
        };
        
        //on open
        this.es.onopen = (a) => {
           console.log("sse opened");
        };
        //on error
        this.es.onerror = (e) => {
            console.log("sse error");
        }

    }

  
    public closeEventSource(){
        if(this.es){
            this.es.close();
        }
     }
      
      broadcastSse(message: any) {
          this.subject.next({ data: message });
      }
    
      public getSse(): Observable<any> {
        return this.subject.asObservable();
      }
}

