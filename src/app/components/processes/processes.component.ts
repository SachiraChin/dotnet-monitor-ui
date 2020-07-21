import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProcessModel } from 'src/app/models/process-model';
import { ConfigurationService } from 'src/app/services/configuration-service';
import { DumpService } from 'src/app/services/dump-service';
import { GcDumpService } from 'src/app/services/gc-dump-service';
import { TraceService } from 'src/app/services/trace-service';
import { ProcessesService } from '../../services/processes-service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit {
  displayedColumns: string[] = ['pid', 'dump', 'gcdump', 'trace', 'more'];
  @Input()
  processes: ProcessModel[];

  constructor(private traceService: TraceService,
              private router: Router,
              private dumpService: DumpService,
              private gcDumpService: GcDumpService) { }

  async ngOnInit(): Promise<void> {
  }

  downloadDump(pid: number): void {
    window.open(this.dumpService.getDownloadUrl(pid), '_blank');
  }

  downloadGcDump(pid: number): void {
    window.open(this.gcDumpService.getDownloadUrl(pid), '_blank');
  }

  downloadTrace(pid: number): void {
    window.open(this.traceService.getDownloadUrl(pid));
  }

  manageApp(pid: number): void {
    this.router.navigate(['/processes', pid]);
  }
}
