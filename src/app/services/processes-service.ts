import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration-service';
import { Observable } from 'rxjs';
import { ProcessModel } from '../models/process-model';

@Injectable({
  providedIn: 'root',
})
export class ProcessesService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getProcesses(): Observable<ProcessModel[]> {
    const url = this.configurationService.getRestApiUrl();
    return this.httpClient.get<ProcessModel[]>(`${url}/processes`);
  }
}
