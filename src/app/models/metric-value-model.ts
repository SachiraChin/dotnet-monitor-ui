export class MetricValueModel {
  metricName: string;
  value: number;
  timestamp: Date;
  timestampReceived: number;
  get timestampReceivedInSeconds(): number {
    return Math.floor(this.timestampReceived / 1000);
  }
}

