import { CallbackType } from '../../domain/callbackType';
import { IEvent } from '../event';

export class HeaderCellResizeEvent implements IEvent {
  public callbackType: CallbackType;
  
  constructor(callbackType: CallbackType) {
    this.callbackType = callbackType;
  }
}