import { IEvent } from './../event';
import { CallbackType } from '../../domain/callbackType';
export class ResizeEvent implements IEvent {
  callbackType: CallbackType;
  constructor(callbackType: CallbackType) {
    this.callbackType = callbackType;
  }
}