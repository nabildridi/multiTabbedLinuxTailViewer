import { ConnectionData } from 'src/app/model/connection';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'add-form',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddFormComponent implements OnInit {
   
    constructor(private httpService : HttpService, private toastService: ToastService,
                private ddr: DynamicDialogRef, private ddc: DynamicDialogConfig) {}
    
    entity : ConnectionData;
    pwdMode : any = "password";
    mode : string = "update";

    ngOnInit() {
        this.entity = this.ddc.data.entity;
        if( this.entity == null){
            this.mode = "add";
            this.entity = new ConnectionData();
        }       
    }

    
    onSubmit() {

        if(this.pwdMode === "password"){
            this.entity.pemPrivateKey = null;
        }else{
            this.entity.password = null;
        }

        if(this.mode === "add"){

            this.httpService.addRecord(this.entity).subscribe(
                data =>{
                    this.toastService.showSuccess('Success', 'Connection added');
                    this.ddr.close();
                },
                error => {
                    this.toastService.showError('Server Error', 'Could not call the server');                     
                }
            );      

        }else{

            this.httpService.updateRecord(this.entity).subscribe(
                data =>{                        
                    this.toastService.showSuccess('Success', 'Record is updated');
                    this.ddr.close();
                },
                error => {
                    this.toastService.showError('Server Error', 'Could not call the server');                    
                }
            );

        }
    }




    processUpload(event) {
        for (let file of event.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = reader.result.toString().trim();
                this.entity.pemPrivateKey = text;
            }
            reader.readAsText(file);

        }
      }

}
