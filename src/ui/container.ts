import { ipcRenderer, remote } from 'electron';
import { MenuBar } from './menuBar';
import { Callback, CallbackType } from './event'
import { FileListContainer } from './fileListContainer';
import { FileModel } from '../file/fileModel';
import { ExtractWrapper, ArchiveEntry } from '../helper/wrapper';
import { Grid, GridConfig, GridColumn, GridColumnFactory } from './grid/grid';
import { ZipController } from '../7z/zipController';

export class Container {
  private readonly _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _fileListContainer: FileListContainer;
  private _zipController: ZipController;
  private _grid: Grid;
  private _gridContainer: HTMLDivElement;
  private _gridConfig: GridConfig;
  private _archivePath: string = '';
  private _lastDestDir: string = '';

  constructor() {
    this._domNode = document.createElement('div');
    this._domNode.className = 'container'
    this._menuBar = new MenuBar();
    this._menuBar.registerCallback(new Callback(CallbackType.EXTRACT, this.btnExtractCallback.bind(this)));
    this._domNode.appendChild(this._menuBar.getDomNode());
    this._zipController = new ZipController();
    ipcRenderer.on('archive-path', this.listArchiveContent.bind(this));
    this.enableDisableButtons();
  }

  private enableDisableButtons() {
    if (this._archivePath === '') {
      this._menuBar.disableBtnExtract();
    } else {
      this._menuBar.enableBtnExtract();
    }
  }

  private selectDestinationCallback(destDir) {
    if (destDir === void 0) {
      return;
    }
    this._lastDestDir = destDir;
    const selectedFiles = this._grid.getSelectedFilenames();
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

  public listArchiveContent(event, archivePath) {
    this._archivePath = archivePath;
    const archiveContent = this._zipController.openArchive(archivePath);
    // this._fileListContainer = new FileListContainer(archiveContent);
    // this._domNode.appendChild(this._fileListContainer.getDomNode());
    if (this._grid) {
      this._domNode.removeChild(this._grid.getDomNode());
    }
    this._gridConfig = new GridConfig();
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Name').setWidth(120).setSortable(true).build());
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Size').setWidth(20).setSortable(true).build());
    this._gridConfig.addColumn(new GridColumnFactory().setTitle('Compressed Size').setWidth(200).setSortable(false).build());
    this._grid = new Grid(this._gridConfig);
    for (let content of archiveContent) {
      this._grid.addRow(new ArchiveEntry(content.name, content.size, content.compressedSize));
      // this._grid.addRow([content.name, content.size, content.compressedSize]);
    }
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