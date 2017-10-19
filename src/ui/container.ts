import { MenuBar } from './menuBar';
import { FileListContainer } from './fileListContainer';
import { FileModel } from '../file/fileModel';
import { Grid, GridConfig, GridColumn, GridColumnFactory } from './grid/grid';
import { ZipController } from '../7z/zipController'
import { ipcRenderer } from 'electron';

export class Container {

  private _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _fileListContainer: FileListContainer;
  private _zipController: ZipController;
  private _grid: Grid;
  private _gridConfig: GridConfig;

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
    // this._fileListContainer = new FileListContainer(archiveContent);
    // this._domNode.appendChild(this._fileListContainer.getDomNode());
    
    this._gridConfig = new GridConfig();
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Name').setWidth(20).setSortable(true).build());
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Size').setWidth(20).setSortable(true).build());
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Compressed Size').setWidth(200).setSortable(false).build());
    this._grid = new Grid(this._gridConfig);
    for (let content of archiveContent) {
      this._grid.addRow([content.name, content.size, content.compressedSize]);
    }
    this._domNode.appendChild(this._grid.getDomNode());
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }
}