import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, OnDestroy, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MessageService, Message } from "primeng/api";
import { ConnectionData } from "src/app/model/connection";
import { EventSourceService } from "src/app/services/eventSource.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'tail-view',
  templateUrl: './tailview.component.html',
  styleUrls: ['./tailview.component.css']
  
})
export class TailViewComponent implements OnInit, OnDestroy, AfterViewChecked {


    editorOptions:any = {printMargin: false};
    @ViewChild('editor', {static: true}) editorContainer : any;

    disableScrollDown = false;

    @Input() connection : ConnectionData;
    messages : string ="";
    subscription: Subscription;
    fontSize : number = 18;
    errorMsgs: Message[] = [];

    constructor(private eventSourceService : EventSourceService,  private httpService : HttpService, private messageService: MessageService) {}
    
    ngOnInit() {

       
       this.httpService.connect(this.connection).subscribe(
               data =>{                        
                   
                   this.sshSubscribe();
               },
               error => {                           
                    this.errorMsgs.push({key: this.connection.id, severity:'error', summary:'Error : ', detail:'Could not make ssh connection'});
                }
        );
       
    }   
 
    ngAfterViewChecked() {

        this.editorContainer.getEditor().session.on("changeScrollTop",(scrollTop) => {

            let scrollHeight = this.editorContainer.getEditor().renderer.scrollBar.scrollHeight;
            let clientHeight = this.editorContainer.getEditor().renderer.scrollBar.element.clientHeight;

            let scrollPosition = Math.floor(scrollHeight - scrollTop);
            let atBottom = scrollPosition === clientHeight;
            
            if (atBottom) {
                this.disableScrollDown = false
            } else {
                this.disableScrollDown = true
            }

        })
    }
      
    
    onTextAdded(code : any){
        if (this.disableScrollDown) {
            return
        }
        try {
            var row = this.editorContainer.getEditor().session.getLength() - 1;
            var column = this.editorContainer.getEditor().session.getLine(row).length; 
            this.editorContainer.getEditor().gotoLine(row + 1, column);
        } catch(err) { }
    }

    sshSubscribe(){
        this.subscription = this.eventSourceService.getSse().subscribe(
                receivedMessage =>{             

                    

                    if(receivedMessage.data.connectionId === this.connection.id){

                        if(receivedMessage.data.type === "Message"){
                            this.messages += receivedMessage.data.payload;
                        }
 
                        if(receivedMessage.data.type === "Error"){
                           
                            this.errorMsgs.push({key: this.connection.id, severity:'error', summary:'Error : ', detail:receivedMessage.data.payload});
                        }

                    }
                    
                },
                error => {}
         );
    }
    
    clear() {
        this.messages = "";
    }    
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
   
}
