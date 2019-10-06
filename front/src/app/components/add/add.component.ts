import { Component, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { HttpCallsService } from "src/app/services/http.service";

@Component({
  selector: 'add-form',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddFormComponent implements OnInit {
  
    addForm: FormGroup;

    
    constructor(private fb: FormBuilder, private messageService: MessageService, private httpCallsService : HttpCallsService) {}
    
    ngOnInit() {
        this.addForm = this.fb.group({
            'name': new FormControl('', Validators.required),
            'host': new FormControl('', Validators.required),
            'port': new FormControl(22, Validators.required),
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.required),
            'sudoPwd': new FormControl(''),
            'filePath': new FormControl('', Validators.required)
        });
    }
    
    onSubmit(value: string) {
        
        this.httpCallsService.addRecord(this.addForm.value).subscribe(
                data =>{
                        
                    this.messageService.add({severity:'info', summary:'Success', detail:'Connection added'});
                    this.addForm.reset()
                },
                error => {
                    this.messageService.add({key: "addErrors", severity:'error', summary:'Server Error', detail:'Could not call the server'});                    
                }
         );
        
       
        
    }

}
