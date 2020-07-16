import { Component, Input, OnInit } from '@angular/core';
import { GcDumpService } from '../../services/gc-dump-service';

@Component({
  selector: 'app-gc-dump',
  templateUrl: './gc-dump.component.html',
  styleUrls: ['./gc-dump.component.scss']
})
export class GcDumpComponent implements OnInit {

  @Input()
  pid: number;

  constructor(private gcDumpService: GcDumpService) { }

  ngOnInit(): void {
  }

  download(): void {
    const url = this.gcDumpService.getDownloadUrl(this.pid);
    window.open(url, '_blank');
  }
}
