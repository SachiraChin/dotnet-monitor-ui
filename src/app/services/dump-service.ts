import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration-service';

@Injectable({
  providedIn: 'root',
})
export class DumpService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getDownloadUrl(pid: number, type?: number): string {
    const url = this.configurationService.getRestApiUrl();
    const params: string[] = [];
    if (type) {
      params.push(`type=${type}`);
    }

    return `${url}/dump/${pid}${(params.length > 0 ? '?' + params.join('&') : '')}`;
  }
}
