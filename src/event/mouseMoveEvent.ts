import { IEvent } from "./event";
import { CallbackType } from "../domain/callbackType";

export class MouseMoveEvent implements IEvent {
  callbackType: CallbackType;
  private _mouseEvent: MouseEvent;

  constructor(e: MouseEvent) {
    this._mouseEvent = e;
  }

  public get mouseEvent(): MouseEvent {
    return this._mouseEvent;
  }

}