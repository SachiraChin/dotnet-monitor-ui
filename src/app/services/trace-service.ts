import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { EventPipeConfigurationModel } from '../models/event-pipe-configuration-model';
import { EventPipeProviderModel } from '../models/event-pipe-provider-model';
import { ConfigurationService } from './configuration-service';

@Injectable({
  providedIn: 'root',
})
export class TraceService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getDownloadUrl(pid: number, profile?: number[], durationSeconds?: number, metricsIntervalSeconds?: number): string {
    const url = this.configurationService.getRestApiUrl();
    const params: string[] = [];
    if (profile && profile.length > 0) {
      params.push(`profile=${profile.reduce((a, b) => a + b, 0)}`);
    }

    if (durationSeconds) {
      params.push(`durationSeconds=${durationSeconds}`);
    }

    if (metricsIntervalSeconds) {
      params.push(`metricsIntervalSeconds=${metricsIntervalSeconds}`);
    }

    return `${url}/trace/${pid}${(params.length > 0 ? '?' + params.join('&') : '')}`;
  }

  async post(pid: number, durationSeconds: number, model: EventPipeConfigurationModel): Promise<void> {
    const url = this.configurationService.getRestApiUrl();
    const response = await this.httpClient.post(`${url}/trace/${pid}?durationSeconds=${durationSeconds}`, model, {
      responseType: 'arraybuffer',
      observe: 'response'
    }).toPromise();
    this.downLoadFile(response, 'application/octet-stream');
  }

  downLoadFile(data: HttpResponse<ArrayBuffer>, type: string): void {
    const contentDisposition = data.headers.get('Content-Disposition');
    const blob = new Blob([data.body], { type });
    const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
