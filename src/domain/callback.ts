import { CallbackType } from './callbackType';
export class Callback {
  public type: CallbackType;
  public callback: Function;
  constructor(type, callback) {
    this.type = type;
    this.callback = callback;
  }
}