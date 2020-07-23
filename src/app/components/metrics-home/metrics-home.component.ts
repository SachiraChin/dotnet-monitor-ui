import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration-service';
import { MetricsComponent } from '../metrics/metrics.component';

@Component({
  selector: 'app-metrics-home',
  templateUrl: './metrics-home.component.html',
  styleUrls: ['./metrics-home.component.scss']
})
export class MetricsHomeComponent implements OnInit {
  form: FormGroup = new FormGroup({
    metricsEndpointUrl: new FormControl(''),
  });

  @ViewChild(MetricsComponent) metricsComponent: MetricsComponent;

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.form.get('metricsEndpointUrl').setValue(this.configurationService.getMetricsApiUrl());
  }

  saveApiUrls(): void {
    this.configurationService.setMetricsApiUrl(this.form.get('metricsEndpointUrl').value);
  }

  async reloadProcesses(): Promise<void> {
    await this.metricsComponent.reload();
  }
}
