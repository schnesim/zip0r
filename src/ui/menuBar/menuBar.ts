import { MenuButton } from './menuButton';
import { Callback, CallbackType } from '../event';

export class MenuBar {
  private _domNode: HTMLDivElement;
  // private _btnExtract: MenuButton;
  // private _btnAdd: MenuButton;
  private _buttons: Array<MenuButton>;
  private _callbacks: Callback[];
  constructor() {
    this._domNode = document.createElement('div');
    this._domNode.classList.add('menu-bar');
    this._callbacks = [];
    // this.createButtons();
  }

  public addButton(title: string, callback: Function) {
    const btn = new MenuButton();
    btn.domNode.textContent = title;
    btn.registerCallback(callback);
    this._buttons.push(btn);
    this._domNode.appendChild(btn.domNode);
  }

  // private createButtons() {
  //   this._btnAdd = new MenuButton();
  //   // this._btnAdd.domNode.classList.add('menu-button-add')
  //   this._btnAdd.domNode.textContent = 'Add';
  //   this._btnAdd.registerCallback(this.addButtonCallback);
  //   this._domNode.appendChild(this._btnAdd.domNode);

  //   this._btnExtract = new MenuButton();
  //   // this._btnExtract.domNode.classList.add('menu-button-extract')
  //   this._btnExtract.domNode.textContent = 'Extract';
  //   this._btnExtract.registerCallback(this.extractButtonCallback.bind(this));
  //   this._domNode.appendChild(this._btnExtract.domNode);
  // }

  // public disableBtnExtract() {
  //   this._btnExtract.domNode.classList.remove('menu-button-active');
  //   this._btnExtract.domNode.classList.add('menu-button-disabled');
  // }

  // public enableBtnExtract() {
  //   this._btnExtract.domNode.classList.add('menu-button-active');
  //   this._btnExtract.domNode.classList.remove('menu-button-disabled');
  // }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }

  public registerCallback(callback: Callback) {
    this._callbacks.push(callback);
  }

  private addButtonCallback() {
    console.log('addButtoncallback');
  }

  private extractButtonCallback() {
    this.fireCallback(CallbackType.EXTRACT);
  }

  private fireCallback(type: CallbackType) {
    this._callbacks.forEach(element => {
      if (element.type === type) {
        element.callback(this);
      }
    });
  }

}