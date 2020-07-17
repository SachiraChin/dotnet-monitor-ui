export class LogModel {
  LogLevel: string;
  EventId: string;
  Category: string;
  Message: string;
  Scopes: LogInnerValue;
  Arguments: LogInnerValue;
}

export interface LogInnerValue {
  [key: string]: string;
}
