import { MenuBar } from './menuBar';
import { FileListContainer } from './fileListContainer';
import { FileModel } from '../file/fileModel';
import { ZipController } from '../7z/zipController'
import { ipcRenderer } from 'electron';

export class Container {
  
  private _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _fileListContainer: FileListContainer;
  private _zipController: ZipController;

  constructor() {
    this._domNode = document.createElement('div');
    this._domNode.className = 'container'
    this._menuBar = new MenuBar();
    this._domNode.appendChild(this._menuBar.getDomNode());
    this._zipController = new ZipController();
    ipcRenderer.on('archive-path', this.listArchiveContent.bind(this));
  }
  
  private listArchiveContent(event, data) {
    const archiveContent = this._zipController.listArchiveContent(data);
    this._fileListContainer = new FileListContainer(archiveContent);
    this._domNode.appendChild(this._fileListContainer.getDomNode());
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }
}