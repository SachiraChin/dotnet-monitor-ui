import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration-service';
import { MetricsComponent } from '../metrics/metrics.component';

@Component({
  selector: 'app-metrics-home',
  templateUrl: './metrics-home.component.html',
  styleUrls: ['./metrics-home.component.scss']
})
export class MetricsHomeComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({
    metricsEndpointUrl: new FormControl(''),
  });
  accessFailed = false;

  @ViewChild(MetricsComponent) metricsComponent: MetricsComponent;

  constructor(private configurationService: ConfigurationService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form.get('metricsEndpointUrl').setValue(this.configurationService.getMetricsApiUrl());
  }

  async ngAfterViewInit(): Promise<void> {
    this.reloadProcesses();
    this.cd.detectChanges();
  }

  saveApiUrls(): void {
    this.configurationService.setMetricsApiUrl(this.form.get('metricsEndpointUrl').value);
  }

  async reloadProcesses(): Promise<void> {
    try {
      this.accessFailed = false;
      this.form.disable();
      await this.metricsComponent.reload();
      this.accessFailed = false;
    } catch (error) {
      this.accessFailed = true;
    }

    this.form.enable();
  }
}
