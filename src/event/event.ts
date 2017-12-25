import { Callback, CallbackType } from '../ui/event';
export interface IEventListener {
  registerCallback(callback: Callback);
  fireCallback(type: CallbackType);
}