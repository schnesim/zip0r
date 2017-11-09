export interface IEvent {
  
}

export class Callback {
  public type: CallbackType;
  public callback: Function;
  constructor(type, callback) {
    this.type = type;
    this.callback = callback;
  }
}

export enum CallbackType {
  EXTRACT,
  ADD
}