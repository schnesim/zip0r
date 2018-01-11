import { Callback } from '../domain/callback';
import { IEvent } from '../ui/event';

export interface IEventListener {
  registerCallback(callback: Callback);
  fireCallback(event: IEvent);
}