import { IEvent } from './../event';
import { CallbackType } from '../../domain/callbackType';
import { MousePosition } from '../../domain/mousePosition';
export class ResizeStartEvent implements IEvent {
  callbackType: CallbackType;
  readonly fieldname: string;
  readonly initialPos: MousePosition;
  constructor(callbackType: CallbackType, fieldname: string, initialPos: MousePosition) {
    this.callbackType = callbackType;
    this.fieldname = fieldname;
    this.initialPos = initialPos;
  }
}