import { ViewElement } from './viewElement';
import { MessageDialog } from './messageDialog';

export class Overlay extends ViewElement {
  
  private _messageDialog: MessageDialog;
  constructor() {
    super();
    this.domNode = document.createElement('div');
    this.domNode.classList.add('overlay');
    this._messageDialog = new MessageDialog();
    this.domNode.appendChild(this._messageDialog.domNode);
  }
}