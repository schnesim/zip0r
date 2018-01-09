import { CallbackType } from '../../domain/callbackType';
import { IEvent } from '../event';

export class HeaderCellClickEvent implements IEvent {
  public callbackType: CallbackType;
  private _fieldname: string;
  private _reverseOrder: boolean;
  constructor(fieldname: string, reverseOrder: boolean, callbackType: CallbackType) {
    this._fieldname = fieldname;
    this._reverseOrder = reverseOrder;
    this.callbackType = callbackType;
  }
  public get fieldname(): string {
    return this._fieldname;
  }
  public get reverseOrder(): boolean {
    return this._reverseOrder;
  }
}