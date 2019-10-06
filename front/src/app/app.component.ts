import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './services/configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private configurationService : ConfigurationService){}

  ngOnInit() {
    
    let endpoint = this.configurationService.get("server");
    if(!endpoint){

        if (window && "host" in window.location
            && "protocol" in window.location) {
              let baseUrl = window.location.protocol + "//" + window.location.host;
              this.configurationService.setServerIp(baseUrl);
        }

    }



  }
  

}
