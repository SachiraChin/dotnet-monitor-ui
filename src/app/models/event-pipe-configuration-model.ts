import { EventPipeProviderModel } from './event-pipe-provider-model';

export class EventPipeConfigurationModel {
  providers: EventPipeProviderModel[];
  requestRundown: boolean;
  bufferSizeInMB: number;
}
