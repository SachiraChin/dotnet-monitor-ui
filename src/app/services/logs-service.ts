import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfigurationService } from './configuration-service';
import { LogModel } from '../models/log-model';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  getLogs(pid: number, level?: number, durationSeconds?: number, requestType: string = 'json'): Observable<LogModel[] | string[]> {
    const observable = new Observable<LogModel[] | string[]>((subscriber) => {
      const url = this.configurationService.getRestApiUrl();
      const params: string[] = [];
      if (durationSeconds) {
        params.push(`durationSeconds=${durationSeconds}`);
      }

      if (level) {
        params.push(`level=${level}`);
      }

      const requestUrl = `${url}/logs/${pid}${(params.length > 0 ? '?' + params.join('&') : '')}`;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', requestUrl, true);
      xhr.setRequestHeader('Accept', requestType === 'json' ? 'application/x-ndjson' : 'text/event-stream');
      let lastIndex = 0;
      xhr.onprogress = (ev: ProgressEvent<EventTarget>) => {
        if (requestType === 'json') {
          const values = xhr.responseText.split('\n').filter(e => e && e !== '');
          const newLogsJson = values.splice(lastIndex, values.length - lastIndex);
          const newLogs = newLogsJson.map(e => {
            try {
              return JSON.parse(e);
            } catch (error) {
              console.log('JSON parse error', e, error);
              return undefined;
            }
          }).filter(e => e);
          subscriber.next(newLogs);
          lastIndex = values.length;
        } else if (requestType === 'text') {
          const values = xhr.responseText.split('\n\n').filter(e => e && e !== '');
          const newLogsText = values.splice(lastIndex, values.length - lastIndex);

          subscriber.next(newLogsText);
          lastIndex = values.length;
        }
      };
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
          subscriber.complete();
        }
      };
      xhr.onerror = (e) => {
        subscriber.error(e);
      };
      // xhr.onload = (e) => {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       subscriber.complete();
      //     } else {
      //       subscriber.error(e);
      //     }
      //   }
      // };
      xhr.send();

      return () => {
        xhr.abort();
      };
    });

    return observable;
  }

}

