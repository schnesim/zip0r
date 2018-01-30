import { CallbackType } from '../domain/callbackType';
import { EventType } from '../domain/eventType';

export interface IEvent {
  readonly callbackType: CallbackType;
}

export interface ICallbackEvent extends IEvent {
  
}

export interface IPublishEvent extends IEvent {
  readonly eventType: EventType;
}