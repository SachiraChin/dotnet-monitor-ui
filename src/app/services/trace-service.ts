import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { EventPipeConfigurationModel } from '../models/event-pipe-configuration-model';
import { EventPipeProviderModel } from '../models/event-pipe-provider-model';
import { ConfigurationService } from './configuration-service';
import { getTimestampBasedFilename } from '../utilities/filename-extensions';

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
    this.downLoadFile(response, 'application/octet-stream', pid);
  }

  downLoadFile(data: HttpResponse<ArrayBuffer>, type: string, pid: number): void {
    const contentDisposition = data.headers.get('Content-Disposition');
    const blob = new Blob([data.body], { type });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = this.getFilename(contentDisposition, pid);
    link.click();

    URL.revokeObjectURL(url);
  }

  getFilename(contentDisposition: string, pid: number): string {
    const staticFilename = getTimestampBasedFilename('.nettrace', new Date(), pid.toString());
    if (!contentDisposition || contentDisposition === '') {
      return staticFilename;
    }
    const contentDispositionParts = contentDisposition.split(';');
    if (contentDispositionParts.length < 2) {
      return staticFilename;
    }
    const filenameSection = contentDispositionParts[1].split('filename');
    if (filenameSection.length < 2) {
      return staticFilename;
    }
    const filenameSectionParts = filenameSection[1].split('=');
    if (filenameSectionParts.length < 2) {
      return staticFilename;
    }
    const filename = filenameSectionParts[1].trim();
    return filename;
  }
}
