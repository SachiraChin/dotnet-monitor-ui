import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorHomeComponent } from './components/monitor-home/monitor-home.component';
import { ProcessComponent } from './components/process/process.component';
import { ProcessesComponent } from './components/processes/processes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MonitorHomeComponent },
  { path: 'processes', component: MonitorHomeComponent },
  { path: 'processes/:id', component: ProcessComponent },
  {
    path: 'metrics',
    loadChildren: () => import('./metrics.module').then(m => m.MetricsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
