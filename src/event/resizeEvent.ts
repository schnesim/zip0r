import { IPublishEvent } from "./event";
import { EventType } from "../domain/eventType";
import { CallbackType } from "../domain/callbackType";
import { MousePosition } from "../domain/mousePosition";

export class ResizeEvent implements IPublishEvent {
  eventType: EventType;
  callbackType: CallbackType;
  private _fieldname: string;
  private _colNumber: number;
  private _initialPos: MousePosition;
  private _newPos: MousePosition;

  constructor(fieldname: string, colNumber: number, initialPos: MousePosition, newPos: MousePosition) {
    this._fieldname = fieldname;
    this._colNumber = colNumber;
    this._initialPos = initialPos;
    this._newPos = newPos;
  }

  // public get colNumber(): number {
  //   return this._colNumber;
  // }

  public get fieldname(): string {
    return this._fieldname;
  }

  public get initialPos(): MousePosition {
    return this._initialPos;
  }

  public get newPos(): MousePosition {
    return this._newPos;
  }
}

