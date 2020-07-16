import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Process } from 'src/app/models/process';
import { ConfigurationService } from 'src/app/services/configuration-service';
import { DumpService } from 'src/app/services/dump-service';
import { TraceService } from 'src/app/services/trace-service';
import { ProcessesService } from '../../services/processes-service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit {
  form: FormGroup = new FormGroup({
    restEndpointUrl: new FormControl(''),
    metricsEndpointUrl: new FormControl(''),
  });

  displayedColumns: string[] = ['pid', 'dump', 'gcdump', 'trace', 'more'];
  processes: Process[];

  constructor(private configurationService: ConfigurationService,
              private processesService: ProcessesService,
              private traceService: TraceService,
              private router: Router,
              private dumpService: DumpService) { }

  async ngOnInit(): Promise<void> {
    this.form.get('restEndpointUrl').setValue(this.configurationService.getRestApiUrl());
    this.form.get('metricsEndpointUrl').setValue(this.configurationService.getMetricsApiUrl());
    this.processes = await this.processesService.getProcesses().toPromise();
  }

  downloadDump(pid: number): void {
    window.open(this.dumpService.getDownloadUrl(pid), '_blank');
  }

  downloadGcDump(pid: number): void {
    window.open(`${this.configurationService.getRestApiUrl()}/gcdump/${pid}`, '_blank');
  }

  downloadTrace(pid: number): void {
    window.open(this.traceService.getDownloadUrl(pid));
  }

  manageApp(pid: number): void {
    this.router.navigate(['/processes', pid]);
  }

  saveApiUrls(): void {
    this.configurationService.setRestApiUrl(this.form.get('restEndpointUrl').value);
    this.configurationService.setMetricsApiUrl(this.form.get('metricsEndpointUrl').value);
  }

  async reloadProcesses(): Promise<void> {
    this.processes = await this.processesService.getProcesses().toPromise();
  }
}
