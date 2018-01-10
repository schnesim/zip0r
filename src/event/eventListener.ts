import { Callback } from '../domain/callback';
import { CallbackType } from '../domain/callbackType';

export interface IEventListener {
  registerCallback(callback: Callback);
  fireCallback(type: CallbackType);
}