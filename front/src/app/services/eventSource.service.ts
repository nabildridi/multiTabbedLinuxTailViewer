import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {EventSourcePolyfill} from 'ng-event-source';
import { ConfigurationService } from "src/app/services/configuration.service";

@Injectable({
    providedIn: 'root'
  })
export class EventSourceService{ 
  
  es : any;
  subject = new Subject<any>();
    
  constructor(private zone: NgZone, private configurationService : ConfigurationService){}

  public getRemoteUpdates() {
        let endpoint = this.configurationService.get("server");
        this.configurationService.generateEmitterId();
        let emitterIdValue = this.configurationService.getEmitterId();
        this.closeEventSource();

        this.es = new EventSourcePolyfill(endpoint+ "/subscribe?emitterId=" + emitterIdValue, {});
        
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

  
      private closeEventSource(){
          if(this.es){
              this.es.close();
          }
      }
      
      broadcastSse(message: any) {
          this.subject.next({ data: message });
      }
    
      clearSse() {
          this.subject.next();
      }
    
      public getSse(): Observable<any> {
          return this.subject.asObservable();
      }

}

