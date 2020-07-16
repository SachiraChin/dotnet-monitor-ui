import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration-service';
import { Observable } from 'rxjs';
import { Process } from '../models/process';

@Injectable({
  providedIn: 'root',
})
export class ProcessesService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getProcesses(): Observable<Process[]> {
    const url = this.configurationService.getRestApiUrl();
    return this.httpClient.get<Process[]>(`${url}/processes`);
  }
}
