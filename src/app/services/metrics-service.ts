import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MetricModel } from '../models/metric-model';
import { MetricValueModel } from '../models/metric-value-model';
import { ConfigurationService } from './configuration-service';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  constructor(private configurationService: ConfigurationService, private httpClient: HttpClient) {

  }

  async getMetrics(): Promise<{
    [key: string]: MetricModel;
  }> {
    const url = this.configurationService.getMetricsApiUrl();
    const response = await this.httpClient.get(`${url}/metrics`,
      {
        responseType: 'text'
      }).toPromise();

    const lines = response.split('\n');
    const metrics: {
      [key: string]: MetricModel;
    } = {};

    for (const line of lines) {
      if (!line || line === '') {
        continue;
      }

      if (line.startsWith('# HELP ')) {
        const details = this.getMetricDetails(line.substr(7));
        this.setNewMetricIfNotExists(metrics, details.name);

        metrics[details.name].metricDisplayName = details.value;
      } else if (line.startsWith('# TYPE ')) {
        const details = this.getMetricDetails(line.substr(7));
        this.setNewMetricIfNotExists(metrics, details.name);

        metrics[details.name].metricType = details.value;
      } else {
        const parts = line.split(' ');
        const metricValue = new MetricValueModel();
        metricValue.metricName = parts[0];
        metricValue.value = +parts[1];
        metricValue.timestampReceived = +parts[2];
        metricValue.timestamp = new Date(metricValue.timestampReceived);

        this.setNewMetricIfNotExists(metrics, metricValue.metricName);

        metrics[metricValue.metricName].metricValues[metricValue.timestampReceivedInSeconds] = metricValue;
      }
    }

    return metrics;
  }

  private setNewMetricIfNotExists(metrics: { [key: string]: MetricModel; }, metricName: string): void {
    if (!metrics[metricName]) {
      metrics[metricName] = new MetricModel();
      metrics[metricName].metricName = metricName;
      metrics[metricName].metricValues = {};
    }
  }

  getMetricDetails(str: string): { name: string; value: string } {
    const index = str.indexOf(' ');
    const name = str.substr(0, index);
    const value = str.substr(index + 1);

    return { name, value };
  }
}
