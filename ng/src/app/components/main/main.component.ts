import { AddFormComponent } from './../add/add.component';
import { ConfirmationService } from 'primeng/api';
import { HttpService } from './../../services/http.service';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { EventSourceService } from "src/app/services/eventSource.service";
import { ConnectionData } from "src/app/model/connection";
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [DialogService]
})
export class MainComponent implements OnInit {

    connections : ConnectionData[] = [];
    openedConnections : ConnectionData[] = [];
    index: number = 0;
    
    constructor(private eventSourceService : EventSourceService, public dialogService: DialogService, 
                private httpService : HttpService, private confirmationService: ConfirmationService,
                private toastService: ToastService) { }

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
        this.httpService.getAllList().subscribe(
                data =>{
                        
                    this.connections = data;
                },
                error => {
                    this.toastService.showError('Server Error', 'Could not retreive result list from the server');                    
                }
         );
    }   
    
   
    onRowDelete(connection : ConnectionData){

        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this connection?',
            accept: () => {
                

                this.httpService.deleteRecord(connection).subscribe(
                    data =>{
                        
                        this.load();
                        this.toastService.showSuccess('Success', 'Record is deleted');
                    },
                    error => {
                        this.toastService.showError('Server Error', 'Could not call the server');                    
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
        this.index = this.openedConnections.length;
    }

   
    handleClose(event){
        var eventIndex = event.index;
        eventIndex = eventIndex - 1;
        var connectionToDisconnect = this.openedConnections[eventIndex];
        this.httpService.disconnect(connectionToDisconnect).subscribe(
            data =>{
                    
                this.toastService.showSuccess('Success', 'Disconnected');
                this.openedConnections.splice(eventIndex, 1);
                this.index = this.openedConnections.length;
            },
            error => {
                this.toastService.showError('Server Error', 'Could not call the server');                        
            }
     );

        
    }

    handleChange(event){
        var eventIndex = event.index;
        if(eventIndex == 0){
            this.load();
        }
    }

    onRowShowEitModal(connection){

        const ref = this.dialogService.open(AddFormComponent, {
            data: {
                entity: connection
            },
            header: 'Edit Connection',
            width: '70%'
        });

        
        ref.onClose.subscribe(() => {
            this.load();
        });

    }

    addConnection(){

        const ref = this.dialogService.open(AddFormComponent, {
            data: {
                entity: null
            },
            header: 'Add Connection',
            width: '70%'
        });

        
        ref.onClose.subscribe(() => {
            this.load();
        });

    }
}
