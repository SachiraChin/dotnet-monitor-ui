import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProcessesComponent } from './components/processes/processes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ProcessComponent } from './components/process/process.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TraceGetComponent } from './components/trace-get/trace-get.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TracePostComponent } from './components/trace-post/trace-post.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogsComponent } from './components/logs/logs.component';
import { DumpComponent } from './components/dump/dump.component';
import { GcDumpComponent } from './components/gc-dump/gc-dump.component';
import { MonitorHomeComponent } from './components/monitor-home/monitor-home.component';

@NgModule({
  declarations: [
    AppComponent,
    ProcessesComponent,
    ProcessComponent,
    TraceGetComponent,
    TracePostComponent,
    LogsComponent,
    DumpComponent,
    GcDumpComponent,
    MonitorHomeComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
