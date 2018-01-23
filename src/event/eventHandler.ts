import { Callback } from '../domain/callback';
import { IEvent } from '../ui/event';

export abstract class IEventHandler {

  private _callbacks: Callback[];

  constructor() {
    this._callbacks = [];
  }

  public getCallbacks(): Callback[] {
    return this._callbacks;
  }

  public registerCallback(callback: Callback) {
    this._callbacks.push(callback);
  }
  
  public fireEvent(event: IEvent) {
    this._callbacks.forEach(callback => {
      if (callback.type === event.callbackType) {
        callback.callback(event);
      }
    });
  }
}