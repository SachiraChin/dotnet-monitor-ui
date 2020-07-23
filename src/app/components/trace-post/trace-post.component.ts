import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, RequiredValidator, AbstractControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EventPipeProviderModel } from '../../models/event-pipe-provider-model';
import { EventPipeConfigurationModel } from '../../models/event-pipe-configuration-model';
import { TraceService } from 'src/app/services/trace-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogInputModel } from '../../models/dialog-input-model';

@Component({
  selector: 'app-trace-post',
  templateUrl: './trace-post.component.html',
  styleUrls: ['./trace-post.component.scss']
})
export class TracePostComponent implements OnInit {
  form: FormGroup = new FormGroup({
    durationSeconds: new FormControl(30),
    requestRundown: new FormControl(true),
    bufferSizeInMB: new FormControl(256),
    providers: new FormArray([this.getNewPipeProvider()]),
  });

  @Input()
  pid: number;

  displayedColumns: string[] = ['name', 'keywords', 'eventLevel', 'arguments', 'options'];
  get providers(): FormArray {
    return this.form.get('providers') as FormArray;
  }

  providersDataSource: MatTableDataSource<AbstractControl> = new MatTableDataSource<AbstractControl>(this.providers.controls);

  constructor(private changeDetectorRefs: ChangeDetectorRef, private traceService: TraceService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getNewPipeProvider(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      keywords: new FormControl(-1),
      eventLevel: new FormControl(5),
      arguments: new FormControl(''),
    });
  }

  getPipeProvider(control: AbstractControl): EventPipeProviderModel {
    const formGroup = control as FormGroup;
    const provider = new EventPipeProviderModel();
    provider.name = formGroup.get('name').value;
    provider.keywords = +formGroup.get('keywords').value;
    provider.eventLevel = +formGroup.get('eventLevel').value;
    const args = formGroup.get('arguments').value;
    provider.arguments = !args || args === '' ? undefined : JSON.parse(args);

    return provider;
  }

  addProvider(): void {
    this.providers.controls.push(this.getNewPipeProvider());
    this.refreshProviders();
  }

  deleteProvider(index: number): void {
    this.providers.removeAt(index);
    this.refreshProviders();
  }

  refreshProviders(): void {
    this.providersDataSource = new MatTableDataSource<AbstractControl>(this.providers.controls);
    this.changeDetectorRefs.detectChanges();
  }

  async download(): Promise<void> {
    this.form.disable();
    try {
      const model = new EventPipeConfigurationModel();
      model.bufferSizeInMB = +this.form.get('bufferSizeInMB').value;
      model.requestRundown = this.form.get('requestRundown').value;
      model.providers = [];
      for (const control of this.providers.controls) {
        model.providers.push(this.getPipeProvider(control));
      }
      await this.traceService.post(this.pid, +this.form.get('durationSeconds').value, model);

    } catch (error) {
      console.log(error);
      const dialogInput = new DialogInputModel();
      dialogInput.buttons = ['Ok'];
      dialogInput.title = 'Error';
      dialogInput.message = 'Error occurred while accessing trace (POST) endpoint. Please validate if all inputs are correct.';
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        data: dialogInput
      });
    }
    this.form.enable();
  }
}
