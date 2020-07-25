import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LogModel } from 'src/app/models/log-model';
import { LogsService } from '../../services/logs-service';
import { debounceTime } from 'rxjs/operators';
import { getTimestampBasedFilename } from '../../utilities/filename-extensions';

class FilterModel {
  logLevels: string[];
  eventIds: string[];
  categories: string[];
  searchText: string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  jsonStreamAvailableColumns: string[] = ['LogLevel', 'EventId', 'Category', 'Message', 'Scopes', 'Arguments'];
  jsonStreamDisplayedColumns: string[] = this.jsonStreamAvailableColumns;
  textStreamDisplayedColumns: string[] = ['Log'];
  logLevels: string[] = [];
  eventIds: string[] = [];
  categories: string[] = [];

  form: FormGroup = new FormGroup({
    durationSeconds: new FormControl(30),
    level: new FormControl(1),
    streamType: new FormControl('json'),
  });
  tableFiltersForm: FormGroup = new FormGroup({
    displayedColumns: new FormControl(this.jsonStreamDisplayedColumns),
    logLevels: new FormControl([]),
    eventIds: new FormControl([]),
    categories: new FormControl([]),
    searchText: new FormControl(''),
  });

  filterModel: FilterModel;

  @Input()
  pid: number;

  logs = new BehaviorSubject<LogModel[] | string[]>([]);
  jsonStreamDataSource = new MatTableDataSource<LogModel>();
  textStreamDataSource = new MatTableDataSource<string>();
  streamSubscription: Subscription;

  get streamType(): string {
    return this.form.get('streamType').value;
  }

  constructor(private logsService: LogsService) {
    this.jsonLogFilterPredicate = this.jsonLogFilterPredicate.bind(this);
    this.textLogFilterPredicate = this.textLogFilterPredicate.bind(this);
  }

  ngOnInit(): void {
    this.filterModel = {
      categories: [],
      eventIds: [],
      logLevels: [],
      searchText: undefined,
    };

    this.jsonStreamDataSource.filterPredicate = this.jsonLogFilterPredicate;
    this.textStreamDataSource.filterPredicate = this.textLogFilterPredicate;
    this.tableFiltersForm.get('displayedColumns').valueChanges.subscribe(val => {
      this.jsonStreamDisplayedColumns = val;
    });
    this.tableFiltersForm.get('logLevels').valueChanges.subscribe((val: string[]) => {
      this.filterModel.logLevels = val;
      this.jsonStreamDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('eventIds').valueChanges.subscribe((val: string[]) => {
      this.filterModel.eventIds = val;
      this.jsonStreamDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('categories').valueChanges.subscribe((val: string[]) => {
      this.filterModel.categories = val;
      this.jsonStreamDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('searchText').valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe((val: string) => {
        this.filterModel.searchText = val;
        this.jsonStreamDataSource.filter = JSON.stringify(this.filterModel);
        this.textStreamDataSource.filter = JSON.stringify(this.filterModel);
      });
  }

  jsonLogFilterPredicate(entry: LogModel, filter: string): boolean {
    if (!filter) {
      return true;
    }

    const filterModel = JSON.parse(filter) as FilterModel;
    if (filterModel.logLevels.length > 0 && filterModel.logLevels.indexOf(entry.LogLevel) < 0) {
      return false;
    }
    if (filterModel.eventIds.length > 0 && filterModel.eventIds.indexOf(entry.EventId) < 0) {
      return false;
    }
    if (filterModel.categories.length > 0 && filterModel.categories.indexOf(entry.Category) < 0) {
      return false;
    }
    if (filterModel.searchText && filterModel.searchText.trim() !== '') {
      return this.contains(entry, filterModel.searchText.toLowerCase());
    }

    return true;
  }

  textLogFilterPredicate(entry: string, filter: string): boolean {
    if (!filter) {
      return true;
    }

    const filterModel = JSON.parse(filter) as FilterModel;
    if (filterModel.searchText && filterModel.searchText.trim() !== '') {
      return this.contains(entry, filterModel.searchText.toLowerCase());
    }

    return true;
  }

  contains(entry: any, search: string): boolean {
    if (!entry) {
      return false;
    }

    if (typeof entry === 'string') {
      return entry.toLowerCase().includes(search);
    }

    return Object.values(entry).some(e => typeof e === 'object' ?
      this.contains(e, search) :
      e.toString().toLowerCase().includes(search)
    );
  }

  stream(): void {
    this.form.disable();
    this.logs = new BehaviorSubject<LogModel[] | string[]>([]);
    this.logLevels = [];
    this.eventIds = [];
    this.categories = [];
    this.jsonStreamDataSource.data = [];
    this.textStreamDataSource.data = [];
    const logLevel = +this.form.get('level').value;
    const durationSeconds = +this.form.get('durationSeconds').value;

    this.streamSubscription = this.logsService.getLogs(this.pid, logLevel, durationSeconds, this.streamType)
      .subscribe(e => {
        this.logs.next(e);
        if (this.streamType === 'json') {
          const values = this.logs.getValue() as LogModel[];
          this.logLevels = values.map(v => v.LogLevel).filter((value, index, self) => self.indexOf(value) === index);
          this.eventIds = values.map(v => v.EventId).filter((value, index, self) => self.indexOf(value) === index);
          this.categories = values.map(v => v.Category).filter((value, index, self) => self.indexOf(value) === index);
          this.jsonStreamDataSource.data = values;
        } else if (this.streamType === 'text') {
          const values = this.logs.getValue() as string[];
          this.textStreamDataSource.data = values;
        }
      }, (error) => {
        this.form.enable();
      }, () => {
        this.form.enable();
      });
  }

  stopStream(): void {
    this.streamSubscription.unsubscribe();
    this.form.enable();
  }

  objectToText(obj: any): string {
    let out = '';
    for (const [key, value] of Object.entries(obj)) {
      out += `<b>${key}</b>: ${value}<br />`;
    }

    return out;
  }

  downloadAllLogs(): void {
    if (this.streamType === 'json') {
      const json = JSON.stringify(this.jsonStreamDataSource.data);
      const filename = getTimestampBasedFilename('.json', new Date(), this.pid.toString());
      this.generateFile(json, filename, 'application/json');
    } else if (this.streamType === 'text') {
      const text = this.textStreamDataSource.data.join('\n\n');
      const filename = getTimestampBasedFilename('.log', new Date(), this.pid.toString());
      this.generateFile(text, filename, 'text/plain');
    }
  }

  downloadFilteredLogs(): void {
    if (this.streamType === 'json') {
      const json = JSON.stringify(this.jsonStreamDataSource.filteredData);
      const filename = getTimestampBasedFilename('.json', new Date(), this.pid.toString());
      this.generateFile(json, filename, 'application/json');
    } else if (this.streamType === 'text') {
      const text = this.textStreamDataSource.filteredData.join('\n\n');
      const filename = getTimestampBasedFilename('.log', new Date(), this.pid.toString());
      this.generateFile(text, filename, 'text/plain');
    }
  }

  generateFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
