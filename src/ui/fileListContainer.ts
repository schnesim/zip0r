import { ViewElement } from './viewElement';
import { FileModel } from '../file/fileModel';

export class FileListContainer extends ViewElement {

  constructor() {
    super();
    this.setDomNode(document.createElement('div'));
  }
}

export class FileElement extends ViewElement {
  private _fileModel: FileModel;
  private _icon: HTMLImageElement;
  private _text: HTMLDivElement;
  constructor(fileModel: FileModel) {
    super();
    this.setDomNode(document.createElement('div'));
    this.getDomNode().classList.add('file-element');
    //this._icon = document.createElement('img');
    this._fileModel = fileModel;
  }
}