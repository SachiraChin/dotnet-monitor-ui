import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LogModel } from 'src/app/models/log-model';
import { LogsService } from '../../services/logs-service';
import { debounceTime } from 'rxjs/operators';

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
  allDisplayedColumns: string[] = ['LogLevel', 'EventId', 'Category', 'Message', 'Scopes', 'Arguments'];
  displayedColumns: string[] = this.allDisplayedColumns;
  logLevels: string[] = [];
  eventIds: string[] = [];
  categories: string[] = [];

  form: FormGroup = new FormGroup({
    durationSeconds: new FormControl(30),
    level: new FormControl(1),
  });
  tableFiltersForm: FormGroup = new FormGroup({
    displayedColumns: new FormControl(this.displayedColumns),
    logLevels: new FormControl([]),
    eventIds: new FormControl([]),
    categories: new FormControl([]),
    searchText: new FormControl(''),
  });

  filterModel: FilterModel;

  @Input()
  pid: number;

  jsonLogs = new BehaviorSubject<LogModel[]>([]);
  jsonLogsDataSource = new MatTableDataSource<LogModel>();
  streamSubscription: Subscription;

  constructor(private logsService: LogsService) {
    this.logFilterPredicate = this.logFilterPredicate.bind(this);
  }

  ngOnInit(): void {
    this.filterModel = {
      categories: [],
      eventIds: [],
      logLevels: [],
      searchText: undefined,
    };

    this.jsonLogsDataSource.filterPredicate = this.logFilterPredicate;
    this.tableFiltersForm.get('displayedColumns').valueChanges.subscribe(val => {
      this.displayedColumns = val;
    });
    this.tableFiltersForm.get('logLevels').valueChanges.subscribe((val: string[]) => {
      this.filterModel.logLevels = val;
      this.jsonLogsDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('eventIds').valueChanges.subscribe((val: string[]) => {
      this.filterModel.eventIds = val;
      this.jsonLogsDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('categories').valueChanges.subscribe((val: string[]) => {
      this.filterModel.categories = val;
      this.jsonLogsDataSource.filter = JSON.stringify(this.filterModel);
    });
    this.tableFiltersForm.get('searchText').valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe((val: string) => {
        this.filterModel.searchText = val;
        this.jsonLogsDataSource.filter = JSON.stringify(this.filterModel);
      });
  }

  logFilterPredicate(entry: LogModel, filter: string): boolean {
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

  contains(entry: any, search: string): boolean {
    if (!entry) {
      return false;
    }

    return Object.values(entry).some(e => typeof e === 'object' ?
      this.contains(e, search) :
      e.toString().toLowerCase().includes(search)
    );
  }

  stream(): void {
    this.form.disable();
    this.streamSubscription = this.logsService.getLogs(this.pid, +this.form.get('level').value, +this.form.get('durationSeconds').value)
      .subscribe(e => {
        this.jsonLogs.next(e);
        const values = this.jsonLogs.getValue();
        this.logLevels = values.map(v => v.LogLevel).filter((value, index, self) => self.indexOf(value) === index);
        this.eventIds = values.map(v => v.EventId).filter((value, index, self) => self.indexOf(value) === index);
        this.categories = values.map(v => v.Category).filter((value, index, self) => self.indexOf(value) === index);
        this.jsonLogsDataSource.data = values;
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
}
