import { IPublishEvent } from './event'
import { IEventListener } from './listener';

export interface IEventPublisher {
  readonly listeners: IEventListener[];
  publish(event: IPublishEvent);
  registerListener(listener: IEventListener);
}