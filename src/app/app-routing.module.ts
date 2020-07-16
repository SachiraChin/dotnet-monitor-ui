import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessComponent } from './components/process/process.component';
import { ProcessesComponent } from './components/processes/processes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProcessesComponent },
  { path: 'processes', component: ProcessesComponent },
  { path: 'processes/:id', component: ProcessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
