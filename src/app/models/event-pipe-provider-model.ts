import { KeyValuePairModel } from './key-value-pair-model';

export class EventPipeProviderModel {
  name: string;
  keywords: number;
  eventLevel: number;
  arguments: KeyValuePairModel[];
}
