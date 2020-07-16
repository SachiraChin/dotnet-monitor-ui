import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DumpService } from '../../services/dump-service';

@Component({
  selector: 'app-dump',
  templateUrl: './dump.component.html',
  styleUrls: ['./dump.component.scss']
})
export class DumpComponent implements OnInit {
  form: FormGroup = new FormGroup({
    type: new FormControl(1),
  });

  @Input()
  pid: number;

  constructor(private dumpService: DumpService) { }

  ngOnInit(): void {
  }

  download(): void {
    const type = +this.form.get('type').value;

    const url = this.dumpService.getDownloadUrl(this.pid, type);
    window.open(url, '_blank');
  }
}
