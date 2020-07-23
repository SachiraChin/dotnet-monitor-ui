import { MetricValueModel } from './metric-value-model';

export class MetricModel {
  metricName: string;
  metricDisplayName: string;
  metricType: string;
  metricValues: {
    [key: number]: MetricValueModel;
  };
  runningAverage: number;
  metricCount: number;
  maxTimestamp: number;
  minTimestamp: number;
}
