import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration-service';

@Injectable({
  providedIn: 'root',
})
export class GcDumpService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getDownloadUrl(pid: number): string {
    const url = this.configurationService.getRestApiUrl();
    return `${url}/gcdump/${pid}`;
  }
}
