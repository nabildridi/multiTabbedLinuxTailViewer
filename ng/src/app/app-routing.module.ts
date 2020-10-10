import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
                        
                        { path: '', redirectTo: 'main', pathMatch: 'full' },                        
                        { path: 'main',  component: MainComponent }
                         

                 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
    
}

