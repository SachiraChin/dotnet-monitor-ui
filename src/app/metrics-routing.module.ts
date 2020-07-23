import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MetricsComponent} from './components/metrics/metrics.component';
import {MetricsHomeComponent} from './components/metrics-home/metrics-home.component';


const routes: Routes = [
  {
    path: '',
    component: MetricsHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetricsRoutingModule { }
