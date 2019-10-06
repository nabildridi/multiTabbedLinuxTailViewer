import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_INITIALIZER } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { HttpClientModule } from "@angular/common/http";
import {TabViewModule} from 'primeng/tabview';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoadingInterceptorService } from "src/app/interceptors/loading-interceptor.service";
import {ToastModule} from 'primeng/toast';
import { MessageService } from "primeng/api";
import {ConfirmationService} from 'primeng/api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {SliderModule} from 'primeng/slider';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import { MainComponent } from "src/app/main/main.component";
import { AddFormComponent } from "src/app/components/add/add.component";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { TailViewComponent } from "src/app/components/tailview/tailview.component";
import {SpinnerModule} from 'primeng/spinner';
import { AceEditorModule } from 'ng2-ace-editor';

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
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    TabViewModule,
    NgxSpinnerModule,
    ToastModule,
    BrowserAnimationsModule,
    PanelModule,
    TableModule,
    ButtonModule,
    SliderModule,
    TooltipModule,
    InputTextModule,
    SpinnerModule,
    AceEditorModule
  ],
  providers: [
              {provide: APP_INITIALIZER, useFactory: ConfigLoader, deps: [ConfigurationService], multi: true},              
              ConfigurationService,
              MessageService,ConfirmationService,
              {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true}
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
