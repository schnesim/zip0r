import { ViewElement } from './viewElement';
import { FileModel } from '../file/fileModel';

export class FileListContainer extends ViewElement {
  private _fileElements: Array<FileElement>;
  constructor(files: Array<FileModel>) {
    super();
    this._fileElements = [];
    this.setDomNode(document.createElement('div'));
    for (let file of files) {
      this._fileElements.push(new FileElement(file));
    }
    for (let file of this._fileElements) {
      this.getDomNode().appendChild(file.getDomNode());
    }
  }
}

export class FileElement extends ViewElement {
  private _fileModel: FileModel;
  private _icon: HTMLImageElement;
  private _iconDiv: HTMLDivElement;
  private _title: HTMLDivElement;
  constructor(fileModel: FileModel) {
    super();
    this.setDomNode(document.createElement('div'));
    this._icon = document.createElement('img');
    if (fileModel.attribute === FileConstants.ATTRIB_FILE) {
      this._icon.src = './img/file.svg';
    } else {
      this._icon.src = './img/folder.svg';
    }
    this._icon.classList.add('file-icon')
    this._iconDiv = document.createElement('div');
    this._iconDiv.appendChild(this._icon);
    this._iconDiv.classList.add('file-icon-div');
    this._title = document.createElement('div');
    this._title.classList.add('file-text');
    this._title.innerText = fileModel.name;

    this.getDomNode().classList.add('file-element');
    this.getDomNode().appendChild(this._iconDiv);
    this.getDomNode().appendChild(this._title);
    //this._icon = document.createElement('img');
    this._fileModel = fileModel;
  }
}

export class FileConstants {
  static readonly ATTRIB_FILE = 'A';
  static readonly ATTRIB_DIRECTORY = 'D';
}