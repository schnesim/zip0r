import { GridConfig } from './grid/gridConfig';
import { GridColumnFactory } from './grid/gridColumnFactory';
import { ipcRenderer, remote } from 'electron';
import { MenuBar } from './menuBar';
import { Callback, CallbackType } from './event';
import { FileModel } from '../file/fileModel';
import { ExtractWrapper, GridRowValues } from '../helper/wrapper';
import { Grid } from './grid/grid';
import { ZipController } from '../7z/zipController';

export class Container {
  private readonly _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _zipController: ZipController;
  private _grid: Grid;
  // We need a container for the grid in order to center it.
  private _gridContainer: HTMLDivElement;
  private _gridConfig: GridConfig;
  private _archivePath: string = '';
  private _lastDestDir: string = '';

  private first: boolean = true;

  constructor() {
    this._domNode = document.createElement('div');
    this._domNode.className = 'container'
    this._menuBar = new MenuBar();
    this._menuBar.registerCallback(new Callback(CallbackType.EXTRACT, this.btnExtractCallback.bind(this)));
    this._domNode.appendChild(this._menuBar.getDomNode());
    this._domNode.addEventListener('click', this.containerClick)
    this._zipController = new ZipController();
    ipcRenderer.on('archive-path', this.populateGrid.bind(this));
    this.enableDisableButtons();
  }

  private containerClick(e: MouseEvent) {
    const grid = document.getElementById('grid');
    if (grid !== null) {
      grid.focus();
    }
  }

  private enableDisableButtons() {
    if (this._archivePath === '') {
      this._menuBar.disableBtnExtract();
    } else {
      this._menuBar.enableBtnExtract();
    }
  }

  private selectDestinationCallback(destDir: Array<string>) {
    if (destDir === void 0) {
      return;
    }
    this._lastDestDir = destDir[0];
    const selectedFiles = this._grid.getSelectedFilenames();
    console.log(selectedFiles);
    const extractWrapper = new ExtractWrapper(this._archivePath, destDir[0], selectedFiles);
    this._zipController.extractFiles(extractWrapper);
  }

  private btnExtractCallback() {
    let dir;
    if (this._lastDestDir === '') {
      dir = require('os').homedir();
    } else {
      dir = this._lastDestDir;
    }
    remote.dialog.showOpenDialog({
      title: 'Open archive',
      defaultPath: dir + '',
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openDirectory']
    }, this.selectDestinationCallback.bind(this));
  }

  public populateGrid(event, archivePath) {
    if (this._gridContainer) {
      this._domNode.removeChild(this._gridContainer);
    }
    this._gridConfig = new GridConfig();
    this._gridConfig.addColumn(
      new GridColumnFactory()
        .setTitle('Name')
        .setWidth(120)
        .setSortable(true)
        .setIsFirst(true)
        .setFieldName(FileModel.prototype.filename)
        .build());
    this._gridConfig.addColumn(
      new GridColumnFactory()
        .setTitle('Size')
        .setWidth(20)
        .setSortable(true)
        .setFieldName(String(FileModel.prototype.size))
        .build());
    this._gridConfig.addColumn(
      new GridColumnFactory()
        .setTitle('Compressed Size')
        .setWidth(200)
        .setSortable(false)
        .setIsLast(true)
        .setFieldName(String(FileModel.prototype.compressedSize))
        .build());
    this._grid = new Grid(this._gridConfig);
    this._grid.archivePath = archivePath;
    this._archivePath = archivePath;

    this._gridContainer = document.createElement('div');
    this._gridContainer.classList.add('grid-container');
    this._gridContainer.appendChild(this._grid.getDomNode());
    this._domNode.appendChild(this._gridContainer);
    this.enableDisableButtons();
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }
}