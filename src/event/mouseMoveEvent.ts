import { IPublishEvent } from "./event";
import { CallbackType } from "../domain/callbackType";
import { EventType } from "../domain/eventType";

export class MouseMoveEvent implements IPublishEvent {
  eventType: EventType = EventType.MOUSE_MOVE;
  callbackType: CallbackType;
  private _mouseEvent: MouseEvent;

  constructor(e: MouseEvent) {
    this._mouseEvent = e;
  }

  public get mouseEvent(): MouseEvent {
    return this._mouseEvent;
  }

}