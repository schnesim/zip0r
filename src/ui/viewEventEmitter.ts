import { ViewElement } from './viewElement';
import { IEvent } from './event';

export abstract class ViewEventEmitter extends ViewElement {
  private _callbacks: Array<Function>;
  public registerCallback(callback: Function) {
    this._callbacks.push(callback);
  }
  private emit(e: IEvent) {

  }
}