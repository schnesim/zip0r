import { CallbackType } from '../../domain/callbackType';
import { IEvent } from '../event';

export class HeaderCellResizeEvent implements IEvent {
  public callbackType: CallbackType = CallbackType.HEADER_RESIZE;
  private _fieldname: string;
  
  constructor(fieldname: string) {
    this._fieldname = fieldname;
  }

  public get fieldname(): string {
    return this._fieldname;
  }
}