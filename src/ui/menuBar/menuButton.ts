import { ViewElement } from '../viewElement';

export class MenuButton extends ViewElement {

  private _callbacks: Function[];

  constructor() {
    super();
    this._callbacks = [];
    this.domNode = document.createElement('div');
    this.domNode.classList.add('menu-button');
    this.domNode.classList.add('menu-button-active');
    this.domNode.addEventListener('click', this.clickEvent.bind(this));
  }

  private clickEvent(e: MouseEvent) {
    if (!this.isActive()) {
      return;
    }
    for (let callback of this._callbacks) {
      // We have to pass "this" so the object called back to knows, where the call is coming from
      // Alternatively we could define a function for each needed callback and not a generic one, which handles them all
      callback(this, e);
    }
  }

  public registerCallback(callback: Function) {
    this._callbacks.push(callback);
  }

  private isActive() {
    return this.domNode.classList.contains('menu-button-active');
  }

}