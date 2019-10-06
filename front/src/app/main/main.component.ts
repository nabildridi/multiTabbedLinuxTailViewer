import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { EventSourceService } from "src/app/services/eventSource.service";
import { ConnectionData } from "src/app/model/connection";
import { HttpCallsService } from "src/app/services/http.service";
import { MessageService, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    connections : ConnectionData[] = [];
    openedConnections : ConnectionData[] = [];
    index: number = 0;
    beforeEditing = new Map();
    
    constructor(private eventSourceService : EventSourceService, 
                private httpCallsService : HttpCallsService, 
                private messageService: MessageService,
                private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.listenToServer();
        this.load();
    }

    hashPassword(password: string){
        return "*".repeat(password.length)
    }
    
    public listenToServer(){
        this.eventSourceService.getRemoteUpdates();
    }
    
    load(){
        this.httpCallsService.getAllList().subscribe(
                data =>{
                        
                    this.connections = data;
                },
                error => {
                    this.messageService.add({key: "mainErrors", severity:'error', summary:'Server Error', detail:'Could not retreive result list from the server'});                    
                }
         );
    }   
    
    
    onRowEditInit(connection : ConnectionData) {
         var clone = _.clone(connection, true);
        this.beforeEditing.set(connection.id, clone);
    }

    onRowEditSave(connection : ConnectionData) {
        
        this.httpCallsService.updateRecord(connection).subscribe(
                data =>{
                        
                    this.messageService.add({severity:'success', summary: 'Success', detail:'Record is updated'});
                },
                error => {
                    this.messageService.add({key: "mainErrors", severity:'error', summary:'Server Error', detail:'Could not call the server'});                    
                }
         );       
        
    }

    onRowEditCancel(connection : ConnectionData, index: number) {
        this.connections[index] = this.beforeEditing.get(connection.id);
        this.beforeEditing.delete(connection.id);
    }     
    
    onRowDelete(connection : ConnectionData){

        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this connection?',
            accept: () => {
                

                this.httpCallsService.deleteRecord(connection).subscribe(
                    data =>{
                        
                        this.load();
                        this.messageService.add({severity:'success', summary: 'Success', detail:'Record is deleted'});
                    },
                    error => {
                        this.messageService.add({key: "mainErrors", severity:'error', summary:'Server Error', detail:'Could not call the server'});                    
                    }
             ); 


            }
        });
        

    }

    
    
    onRowConnect(connection : ConnectionData) {
        
        var foundIndex = _.findIndex( this.openedConnections, function(o) { return o.id == connection.id; });

        if(foundIndex == -1){
            this.openedConnections.push(connection);
        }
       
        this.index = this.openedConnections.length + 1;

    }
   
    handleClose(event){
        var eventIndex = event.index;
        eventIndex = eventIndex - 2;
        var connectionToDisconnect = this.openedConnections[eventIndex];
        this.httpCallsService.disconnect(connectionToDisconnect).subscribe(
            data =>{
                    
                this.messageService.add({severity:'success', summary: 'Success', detail:'Disconnected'});
                this.openedConnections.splice(eventIndex, 1);
            },
            error => {
                this.messageService.add({key: "mainErrors", severity:'error', summary:'Server Error', detail:'Could not call the server'});                    
            }
     );

        
    }

    handleChange(event){
        var eventIndex = event.index;
        if(eventIndex == 0){
            this.load();
        }
    }
}
