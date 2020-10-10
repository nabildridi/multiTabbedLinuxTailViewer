import { TailViewComponent } from './components/tailview/tailview.component';
import { AddFormComponent } from './components/add/add.component';
import { MainComponent } from './components/main/main.component';
import { LoadingInterceptorService } from './services/loading-interceptor.service';
import { ConfigurationService } from './services/configuration.service';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AceEditorModule } from 'ng2-ace-editor';
import {FileUploadModule} from 'primeng/fileupload';
import {TabViewModule} from 'primeng/tabview';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {PanelModule} from 'primeng/panel';
import {SliderModule} from 'primeng/slider';
import {ToastModule} from 'primeng/toast';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DialogModule} from 'primeng/dialog';



export function ConfigLoader(cfg: ConfigurationService) {
  return () => cfg.load();
}


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AddFormComponent,
    TailViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    NgxSpinnerModule,
    AceEditorModule,
    FileUploadModule,
    TabViewModule,
    ConfirmDialogModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    SliderModule,
    ToastModule,
    RadioButtonModule,
    DialogModule,
    DynamicDialogModule
  ],
  entryComponents: [
    AddFormComponent
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: ConfigLoader, deps: [ConfigurationService], multi: true},              
    ConfigurationService,
    MessageService,
    ConfirmationService,
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
