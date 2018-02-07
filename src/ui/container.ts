import { MenuButtonBuilder } from './menuBar/menuButtonBuilder';
import { MenuBar } from './menuBar/menuBar';
import { ipcRenderer, remote } from 'electron';

import { ZipController } from '../7z/zipController';
import { ExtractWrapper } from '../helper/wrapper';
import { Grid } from './grid/grid';
import { GridColumnBuilder } from './grid/gridColumnFactory';
import { GridConfig } from './grid/gridConfig';
import { MenuButton } from './menuBar/menuButton';
import { Callback } from '../domain/callback';
import { CallbackType } from '../domain/callbackType';
import { IPublishEvent } from '../event/event';
import { IEventHandler } from '../event/eventHandler';
import { MouseMoveEvent } from '../event/mouseMoveEvent'
import { IEventPublisher } from '../event/publisher'
import { IEventListener } from '../event/listener';
import { ResizeEvent } from '../event/resizeEvent';
import { ResizeStartEvent } from './grid/resizeStartEvent';
import { Overlay } from './messageOverlay'

export class Container extends IEventHandler implements IEventPublisher {

  private readonly _domNode: HTMLElement;
  private _menuBar: MenuBar;
  private _zipController: ZipController;
  private _grid: Grid;
  // We need a container for the grid in order to center it.
  private _gridContainer: HTMLDivElement;
  private _gridConfig: GridConfig;
  private _archivePath: string = '';
  private _lastDestDir: string = '';
  private _btnAdd: MenuButton;
  private _btnExtract: MenuButton;
  private _listeners: IEventListener[] = [];

  private _resizing: boolean = false;

  constructor() {
    super();
    this._domNode = document.createElement('div');
    this._domNode.className = 'container'
    this._menuBar = new MenuBar();
    this._btnAdd = new MenuButtonBuilder().title('Add').build();
    this._btnExtract = new MenuButtonBuilder().title('Extract').callback(this.btnExtractCallback.bind(this)).build();
    this._menuBar.getDomNode().appendChild(this._btnAdd.domNode);
    this._menuBar.getDomNode().appendChild(this._btnExtract.domNode);
    // todo: this is stupid, registering the callback with the MenuBar. The callback should be registered with the actual button.
    /**
     * this._menuBar.addButton('Add', this.btnAddCallback);
     */
    // this._menuBar.registerCallback(new Callback(CallbackType.EXTRACT, this.btnExtractCallback.bind(this)));
    this._domNode.appendChild(this._menuBar.getDomNode());
    this._domNode.addEventListener('click', this.containerClick)
    this._domNode.addEventListener('mouseup', this.containerMouseUp.bind(this));
    this._domNode.addEventListener('mousemove', this.containerMouseMove.bind(this));
    this._zipController = new ZipController();
    ipcRenderer.on('archive-path', this.populateGrid.bind(this));
    this.enableDisableButtons();


  }

  public get listeners(): IEventListener[] {
    return this._listeners;
  }


  private containerClick(e: MouseEvent) {
    const grid = document.getElementById('grid');
    if (grid !== null) {
      // The grid needs to be focused in order for key navigation to work
      grid.focus();
    }
  }

  private containerMouseMove(e: MouseEvent) {
    if (this._resizing) {
      this.publish(new MouseMoveEvent(e));
      // this.publish(new ResizeEvent());
    }
  }

  publish(event: IPublishEvent) {
    this.listeners.forEach(element => {
      const match = element.eventTypes.find(x => x === event.eventType);
      if (match !== void 0) {
        element.notify(event);
      }
    });
  }

  private containerMouseUp(e: MouseEvent) {
    if (this._resizing) {
      this._resizing = false;
      this.horizontalResizeStopCallback();
    }
  }

  private enableDisableButtons() {
    if (this._archivePath === '') {
      this._btnExtract.domNode.classList.remove('menu-button-active');
      this._btnExtract.domNode.classList.add('menu-button-disabled');
    } else {
      this._btnExtract.domNode.classList.add('menu-button-active');
      this._btnExtract.domNode.classList.remove('menu-button-disabled');
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

  registerListener(listener: IEventListener) {
    this._listeners.push(listener);
  }

  public populateGrid(event, archivePath) {
    if (this._gridContainer) {
      this._domNode.removeChild(this._gridContainer);
    }
    this._gridConfig = new GridConfig();
    this._gridConfig.addColumn(
      new GridColumnBuilder()
        .setTitle('Name')
        .setWidth(120)
        .setSortable(true)
        .setIsFirst(true)
        .setPropertyName('filename')
        .build());
    this._gridConfig.addColumn(
      new GridColumnBuilder()
        .setTitle('Size')
        .setWidth(20)
        .setSortable(true)
        .setPropertyName('size')
        .build());
    this._gridConfig.addColumn(
      new GridColumnBuilder()
        .setTitle('Compressed Size')
        .setWidth(200)
        .setSortable(false)
        .setIsLast(true)
        .setPropertyName('compressedSize')
        .build());
    this._grid = new Grid(this._gridConfig);
    this._grid.archivePath = archivePath; this.registerCallback
    // this._grid.addCallback(new Callback(CallbackType.MOUSE_MOVE, ))
    this._grid.addCallback(new Callback(CallbackType.HORIZONTAL_RESIZE_START, this.horizontalResizeStartCallback.bind(this)));
    this._grid.addCallback(new Callback(CallbackType.HORIZONTAL_RESIZE_STOP, this.horizontalResizeStopCallback.bind(this)));
    this.registerListener(this._grid);

    this._archivePath = archivePath;

    this._gridContainer = document.createElement('div');
    this._gridContainer.classList.add('grid-container');
    this._gridContainer.appendChild(this._grid.getDomNode());
    this._domNode.appendChild(this._gridContainer);
    this.enableDisableButtons();
  }

  private horizontalResizeStartCallback(event: ResizeStartEvent) {
    console.log(event);
    this._resizing = true;
    this._domNode.style.cursor = 'ew-resize';
  }

  private horizontalResizeStopCallback() {
    this._domNode.style.cursor = 'default';
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }
}