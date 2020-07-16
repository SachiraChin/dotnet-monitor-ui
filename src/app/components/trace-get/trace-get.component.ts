import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TraceService } from '../../services/trace-service';

@Component({
  selector: 'app-trace-get',
  templateUrl: './trace-get.component.html',
  styleUrls: ['./trace-get.component.scss']
})
export class TraceGetComponent implements OnInit {
  form: FormGroup = new FormGroup({
    durationSeconds: new FormControl(30),
    profile: new FormControl([1, 2, 8]),
    metricsIntervalSeconds: new FormControl(1),
  });

  @Input()
  pid: number;

  constructor(private traceService: TraceService) { }

  ngOnInit(): void {
  }

  download(): void {
    const duration = +this.form.get('durationSeconds').value;
    const profile = this.form.get('profile').value as number[];
    const metricsIntervalSeconds = +this.form.get('durationSeconds').value;

    const url = this.traceService.getDownloadUrl(this.pid, profile, duration, metricsIntervalSeconds);
    window.open(url, '_blank');
  }
}
