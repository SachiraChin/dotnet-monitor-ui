import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsComponent } from './components/metrics/metrics.component';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MetricsHomeComponent } from './components/metrics-home/metrics-home.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxSliderModule } from '@m0t0r/ngx-slider';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MetricsRoutingModule,

    ReactiveFormsModule,
    FormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,

    ChartsModule,
    NgxSliderModule,
  ],
  declarations: [
    MetricsComponent,
    MetricsHomeComponent,
  ]
})
export class MetricsModule { }
