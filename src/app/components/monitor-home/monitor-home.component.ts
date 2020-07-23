import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProcessModel } from 'src/app/models/process-model';
import { ConfigurationService } from 'src/app/services/configuration-service';
import { ProcessesService } from 'src/app/services/processes-service';

@Component({
  selector: 'app-monitor-home',
  templateUrl: './monitor-home.component.html',
  styleUrls: ['./monitor-home.component.scss']
})
export class MonitorHomeComponent implements OnInit {
  form: FormGroup = new FormGroup({
    restEndpointUrl: new FormControl(''),
    metricsEndpointUrl: new FormControl(''),
  });
  processes: ProcessModel[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private processesService: ProcessesService) { }

  async ngOnInit(): Promise<void> {
    this.form.get('restEndpointUrl').setValue(this.configurationService.getRestApiUrl());
    this.processes = await this.processesService.getProcesses().toPromise();
  }

  saveApiUrls(): void {
    this.configurationService.setRestApiUrl(this.form.get('restEndpointUrl').value);
  }

  async reloadProcesses(): Promise<void> {
    this.processes = await this.processesService.getProcesses().toPromise();
  }

}
