import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class LoadingInterceptorService implements HttpInterceptor{
    
    private pendingRequests = 0;
    
    constructor(private spinner: NgxSpinnerService) { }
    
    
    
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {              
        
        this.pendingRequests++;
        if (1 === this.pendingRequests) {
            this.spinner.show();
        }
        
        return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {                   
                    return event;
                }),
                catchError(err => {                     
                    return Observable.throw(err); 
                }),
                finalize(() => {

                        this.pendingRequests--;
                        if (0 === this.pendingRequests) {
                            this.spinner.hide();
                        }

                })
                
       
        );
        
        
    }

  
}
