import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as lod from "lodash";

@Injectable({
    providedIn: 'root'
  })
export class ConfigurationService{
    
    emitterId : string;
    
    
  constructor(private http: HttpClient){}

  public params : any
  
  public generateEmitterId(){
      this.emitterId = (Math.random() + 1).toString().slice(2);
  }
  
  public getEmitterId(){
      return this.emitterId;
  }

  load():Promise<any> {
      
      return this.http.get("assets/config/config.json") 
      .pipe(
        tap(config => {
            this.params = config
        })
      )
      .toPromise();      
     
    }
  
  get(key : string) : string{
      return lod.get(this.params, key);
  }

  setServerIp(serverIp : string){
    this.params.server = serverIp;
  }

}

