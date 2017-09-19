import { MenuBar } from './menuBar';
import { FileListContainer } from './fileListContainer';
import { ipcRenderer } from 'electron';

export class UiController {
  private _container: Container;
  constructor() {
    this._container = new Container();
    document.getElementsByTagName('body')[0].appendChild(this._container.getDomNode());

    ipcRenderer.on('archive-path', this.doSomething);
  }

  private doSomething(event, data) {
    console.log(data);
  }
}

export class Container {
  private _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _archiveContent: FileListContainer;
  constructor() {
    this._domNode = document.createElement('div');
    this._domNode.className = 'container'
    this._menuBar = new MenuBar();
    this._domNode.appendChild(this._menuBar.getDomNode());
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }
}