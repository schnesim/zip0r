import { ViewElement } from "./viewElement";

export class MessageDialog extends ViewElement {
  
  private _label: HTMLSpanElement;
  private _dialogFrame: HTMLDivElement;
  private _inputPassword: HTMLInputElement;
  constructor() {
    super();
    this.domNode = document.createElement('div');
    this.domNode.classList.add('dialogFrame');
    this._label = document.createElement('span');
    this._label.innerText = 'Password:';
    this._inputPassword = document.createElement('input');
    this._inputPassword.type = 'text';
    this._inputPassword.classList.add('inputField');
    this._inputPassword.addEventListener('click', this.focusInputField.bind(this));
    this.domNode.appendChild(this._label);
    this.domNode.appendChild(this._inputPassword);

  }

  private focusInputField() {
    this._inputPassword.focus();
  }
}