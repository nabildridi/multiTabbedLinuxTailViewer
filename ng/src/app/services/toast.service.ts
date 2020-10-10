import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {


  constructor(private messageService: MessageService) {}

  public showMesssage(severity : any, title : any, message : any)  {
    this.messageService.add({severity: severity, summary:title, detail:message, life : 10000});
  }

  public showSuccess(title : any, message : any)  {
    this.showMesssage("success",  title, message);
  }

  public showError(title : any, message : any)  {
    this.messageService.add({severity : "error", summary:title, detail:message, life : 10000});
  }
  
}