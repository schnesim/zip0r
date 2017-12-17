import { Callback, CallbackType } from '../ui/event';
export interface IEventListener {
  readonly _callbacks: Callback[];
  fireCallback(type: CallbackType);
}