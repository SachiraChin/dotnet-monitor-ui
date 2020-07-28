import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  subscription: Subscription;
  defaultRestApiUrl = 'http://localhost:52323';
  defaultMetricsApiUrl = 'http://localhost:52325';

  setRestApiUrl(url: string): void {
    localStorage.setItem('RestApiUrl', url);
  }

  getRestApiUrl(): string {
    let url = localStorage.getItem('RestApiUrl');
    if (!url) {
      url = this.defaultRestApiUrl;
      this.setRestApiUrl(url);
    }

    return url;
  }

  setMetricsApiUrl(url: string): void {
    localStorage.setItem('MetricsApiUrl', url);
  }

  getMetricsApiUrl(): string {
    let url = localStorage.getItem('MetricsApiUrl');
    if (!url) {
      url = this.defaultMetricsApiUrl;
      this.setMetricsApiUrl(url);
    }

    return url;
  }
}
