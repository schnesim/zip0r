import { ResizeStartEvent } from './resizeStartEvent';
import { ZipController } from '../../7z/zipController';
import { Constants } from '../../constants';
import { Callback } from '../../domain/callback';
import { CallbackType } from '../../domain/callbackType';
import { FileType } from '../../enum';
import { FileModel } from '../../file/fileModel';
import { GridRowValues } from '../../helper/wrapper';
import { GetKey, KeyCode } from '../../keycode';
import { GridConfig } from './gridConfig';
import { GridRow } from './gridRow';
import { HeaderCell } from './headerCell';
import { HeaderCellClickEvent } from './headerCellClickEvent';
import { HeaderCellResizeEvent } from './headerCellResizeEvent';
import { GridColumnConfig } from './gridColumn';
import { IEventHandler } from '../../event/eventHandler';
import { EventType } from '../../domain/eventType';
import { IEventListener } from '../../event/listener';
import { IPublishEvent } from '../../event/event';
import { IEventPublisher } from '../../event/publisher';
import { ResizeEvent } from '../../event/resizeEvent';
import { MousePosition } from '../../domain/mousePosition';
import { MouseMoveEvent } from '../../event/mouseMoveEvent';

export class Grid extends IEventHandler implements IEventListener, IEventPublisher {
  registerListener(listener: IEventListener) {
    this._listeners.push(listener);
  }
  publish(event: IPublishEvent) {
    this.listeners.forEach(element => {
      const match = element.eventTypes.find(x => x === event.eventType);
       if (match !== void 0) {
         element.notify(event);
       }
    });
  }
  notify(event: IPublishEvent) {
    switch (event.eventType) {
      case EventType.MOUSE_MOVE: {
        if (this._resizing) {
          const e = <MouseMoveEvent> event;
          const resizeEvent = new ResizeEvent(this._resizeStartEvent.fieldname, 0, this._resizeStartEvent.initialPos,
            new MousePosition(e.mouseEvent.clientX, e.mouseEvent.clientY));
          this.resizeColumn(resizeEvent);
        }
      }
    }
  }
  public get listeners() : IEventListener[] {
    return this._listeners;
  }
  
  
  private _domNode: HTMLTableElement;
  private _htmlTableHead: HTMLTableSectionElement;
  private _htmlTableHeaderRow: HTMLTableRowElement;
  private _gridHeaderRow: Array<HeaderCell>
  private _eventTypes: EventType[];
  private _gridRows: Array<GridRow>;
  private _gridConfig: GridConfig;
  private _columnCount: number;
  private _archivePath: string;
  private _currentRoot: FileModel;
  private _archiveContent: FileModel;
  private _zipController: ZipController;
  private _ctrlPressed: boolean = false;
  private _shiftPressed: boolean = false;
  private _resizing: boolean = false;
  private _resizeStartEvent: ResizeStartEvent;
  private _listeners: IEventListener[] = [];
  

  constructor(gridConfig: GridConfig) {
    super();
    this._gridConfig = gridConfig;
    this._gridRows = [];
    this._gridHeaderRow = [];
    this._zipController = new ZipController();
    this._htmlTableHeaderRow = this.createTableHeaderRow(gridConfig);

    this._htmlTableHead = document.createElement('thead');
    this._htmlTableHead.appendChild(this._htmlTableHeaderRow);

    this._domNode = document.createElement('table');
    this._domNode.id = 'grid';
    this._domNode.classList.add('table');
    this._domNode.appendChild(this._htmlTableHead);
    this._domNode.tabIndex = 0; // https://stackoverflow.com/questions/887551/how-can-i-trigger-an-onkeydown-event-on-html-table-on-firefox
    this._domNode.addEventListener('keydown', this.gridKeyDownHandler.bind(this));
    this._domNode.addEventListener('keyup', this.gridKeyUpHandler.bind(this));

    this._eventTypes = [];
    this._eventTypes.push(EventType.MOUSE_MOVE);
  }

  private gridKeyDownHandler(e: KeyboardEvent) {
    this._ctrlPressed = e.ctrlKey;
    this._shiftPressed = e.shiftKey;
    if (GetKey(e.keyCode) === KeyCode.DownArrow) {
      this.handleKeyDownEvent(e);
    }
    else if (GetKey(e.keyCode) === KeyCode.UpArrow) {
      this.handleKeyUpEvent(e);
    }
    else if (GetKey(e.keyCode) === KeyCode.Enter
      && this.getFocusedRow().data.type === FileType.DIRECTORY) {
      this.openDirectory(this.getFocusedRow());
    }
  }

  private handleKeyUpEvent(e: KeyboardEvent) {
    const focusedRow = this.getFocusedRow();
    if (!focusedRow && GetKey(e.keyCode) === KeyCode.UpArrow) {
      // No row has focus, so focus the last one
      if (this._gridRows.length > 0) {
        this._gridRows[this._gridRows.length - 1].focused = true;
      }
    } else if (e.shiftKey && this.hasPreviousRow() && !this.previousRowSelected(focusedRow)) {
      // Select current row and focus previous row
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = true;
      this._gridRows[index].focused = false;
      this._gridRows[index - 1].focused = true;
    } else if (e.shiftKey && this.hasPreviousRow() && this.previousRowSelected(focusedRow)) {
      // Focus previous row and unselect current row
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = false;
      this._gridRows[index].focused = false;
      this._gridRows[index - 1].focused = true;
    } else if (this.hasPreviousRow()) {
      // Shift key not pressed, so clear selection and focus previous row
      this.deselectAll();
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = false;
      this._gridRows[index].focused = false;
      this._gridRows[index - 1].focused = true;
    }
  }

  private handleKeyDownEvent(e: KeyboardEvent) {
    const focusedRow = this.getFocusedRow();
    if (!focusedRow && GetKey(e.keyCode) === KeyCode.DownArrow) {
      // No row has focus, so focus the first one
      if (this._gridRows.length > 0) {
        this._gridRows[0].focused = true;
      }
    } else if (e.shiftKey && this.hasNextRow() && !this.nextRowSelected(focusedRow)) {
      // Select current row and focus next row
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = true;
      this._gridRows[index].focused = false;
      this._gridRows[index + 1].focused = true;
    } else if (e.shiftKey && this.hasNextRow() && this.nextRowSelected(focusedRow)) {
      // Focus next row and unselect current row
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = false;
      this._gridRows[index].focused = false;
      this._gridRows[index + 1].focused = true;
    } else if (this.hasNextRow()) {
      // Shift key not pressed, so clear selection and focus next row
      this.deselectAll();
      const index = this.getRowIndex(focusedRow);
      this._gridRows[index].selected = false;
      this._gridRows[index].focused = false;
      this._gridRows[index + 1].focused = true;
    }
  }

  private previousRowSelected(focusedRow: GridRow): boolean {
    const index = this.getRowIndex(focusedRow);
    if (index > 0) {
      return this._gridRows[index - 1].selected;
    }
    return false;
  }

  private nextRowSelected(focusedRow: GridRow): boolean {
    const index = this.getRowIndex(focusedRow);
    if (index < this._gridRows.length - 1) {
      return this._gridRows[index + 1].selected;
    }
    return false;
  }

  private hasNextRow() {
    return this.getRowIndex(this.getFocusedRow()) < this._gridRows.length - 1;
  }

  private hasPreviousRow() {
    return this.getRowIndex(this.getFocusedRow()) > 0;
  }

  private gridKeyUpHandler(e: KeyboardEvent) {
    this._ctrlPressed = e.ctrlKey;
    this._shiftPressed = e.shiftKey;
  }

  private getRowIndex(gridRow: GridRow): number {
    for (let i = 0; i < this._gridRows.length; i++) {
      if (gridRow === this._gridRows[i]) {
        return i;
      }
    }
  }

  private getFocusedRow(): GridRow {
    for (const row of this._gridRows) {
      if (row.focused) {
        return row;
      }
    }
    return void 0;
  }

  private createTableHeaderRow(gridConfig: GridConfig): HTMLTableRowElement {
    const result = document.createElement('tr');
    result.className = 'header';
    let columnCount = 0;
    this._gridHeaderRow = [];
    for (var index = 0; index < gridConfig.getColumnsConfig().length; index++) {
      var columnConfig = gridConfig.getColumnsConfig()[index];
      const isFirst = index === 0;
      const isLast = index === gridConfig.getColumnsConfig().length - 1;
      const headerCell = new HeaderCell(columnConfig, columnCount);
      this.registerListener(headerCell);
      this._gridHeaderRow.push(headerCell);
      /**
       * Maybe I should replace this with:
       * headerCell.onClick = this.headerCellClickCallback.bind(this)
       * headerCell.onResize...
       */
      headerCell.registerCallback(new Callback(CallbackType.HEADER_CLICK, this.headerCellClickCallback.bind(this)));
      headerCell.registerCallback(new Callback(CallbackType.HEADER_RESIZE, this.headerCellResizeCallback.bind(this)));
      headerCell.registerCallback(new Callback(CallbackType.HORIZONTAL_RESIZE_START, this.resizeStartCallback.bind(this)));
      headerCell.registerCallback(new Callback(CallbackType.HORIZONTAL_RESIZE_STOP, this.resizeStopCallback.bind(this)));
      result.appendChild(headerCell.domNode);
      columnCount++;
    }
    return result;
  }

  private resizeColumn(event: ResizeEvent) {
    const positionDelta = event.initialPos.x - event.newPos.x;
    console.log(positionDelta)
    const columnConfig = this.getColumnConfigByFieldname(this._gridConfig, event.fieldname);
    if (positionDelta === 0) {
      return;
    }
    if (positionDelta > 0) {
      // New position left of original position, so decrease column width
      const newWidth = (parseInt(columnConfig.width) - positionDelta).toString();
      const oldWidth = columnConfig.width;
      console.log(oldWidth+ ' ' + newWidth)
      columnConfig.width = newWidth;
    } else {
      // New position right of original position, so increase column width
      const newWidth = (parseInt(columnConfig.width) + positionDelta).toString();
      const oldWidth = columnConfig.width;
      console.log(oldWidth+ ' ' + newWidth)
      columnConfig.width = newWidth;
    }
    console.log(this._gridHeaderRow[0].domNode.style.width)
    this._gridHeaderRow[0].domNode.style.width = columnConfig.width + 'px'
  }

  private headerCellResizeCallback(event: HeaderCellResizeEvent) {
    return;
    const positionDelta = event.initialPos.x - event.newPos.x;
    console.log(positionDelta)
    const columnConfig = this.getColumnConfigByFieldname(this._gridConfig, event.fieldname);
    if (positionDelta === 0) {
      return;
    }
    if (positionDelta > 0) {
      // New position left of original position, so decrease column width
      const newWidth = (parseInt(columnConfig.width) - positionDelta).toString();
      const oldWidth = columnConfig.width;
      console.log(oldWidth+ ' ' + newWidth)
      columnConfig.width = newWidth;
    } else {
      // New position right of original position, so increase column width
      const newWidth = (parseInt(columnConfig.width) + positionDelta).toString();
      const oldWidth = columnConfig.width;
      console.log(oldWidth+ ' ' + newWidth)
      columnConfig.width = newWidth;
    }
    console.log(this._gridHeaderRow[0].domNode.style.width)
    this._gridHeaderRow[0].domNode.style.width = '500px'

    // this._gridConfig.getColumnsConfig()[0].width = "200";
    // this.refreshHeaderRow();
    // this.refreshGridRows();
    // this.refreshHtml();
  }

  private getColumnConfigByFieldname(gridConfig: GridConfig, fieldname: string): GridColumnConfig {
    let result = void 0;
    for (let config of gridConfig.getColumnsConfig()) {
      if (config.fieldname === fieldname) {
        result = config;
        break;
      }
    }
    return result;
  }

  public addCallback(callback: Callback) {
    this.registerCallback(callback);
  }

  private headerCellClickCallback(event: HeaderCellClickEvent) {
    this.resetSortIcon();
    this._gridRows = this.sortRowsByFieldNumber(event.fieldname, event.reverseOrder);
    this.refreshHtml();
  }

  private resizeStartCallback(event: ResizeStartEvent) {
    this._resizing = true;
    this._resizeStartEvent = event;
    this.fireEvent(event);
  }

  private resizeStopCallback(event: ResizeStartEvent) {
    this._resizing = false;
    this.fireEvent(event);
  }

  private resetSortIcon() {
    this._gridHeaderRow.forEach(row => {
      row.resetSortIcon();
    });
  }

  private refreshHeaderRow() {
    this._htmlTableHead.innerHTML = '';
    this._htmlTableHeaderRow = this.createTableHeaderRow(this._gridConfig);
    this._htmlTableHead.appendChild(this._htmlTableHeaderRow);
  }

  private refreshGridRows() {
    this._gridRows = [];
    this._currentRoot.children.forEach(child => {
      const values = new GridRowValues(child);
      const row = new GridRow(values, this._gridConfig, this._gridRows.length);
      this._gridRows.push(row);
    });
  }

  /**
   * The grid gets populated upen setting of the archive path
   */
  set archivePath(value: string) {
    this._gridRows = [];
    this._archivePath = value;
    this._archiveContent = this._zipController.openArchive(value);
    this._currentRoot = this._archiveContent;
    this.refreshHeaderRow();
    this.refreshGridRows()
    this.refreshHtml();
  }

  private refreshHtml() {
    this._domNode.innerHTML = '';
    // this._gridRows = [];
    this._domNode.appendChild(this._htmlTableHead);
    this._gridRows.forEach(row => {
      row.domNode.addEventListener('click', this.tableRowClick.bind(this, row));
      row.domNode.addEventListener('dblclick', this.tableRowDblClick.bind(this, row));
      this._domNode.appendChild(row.domNode);
    })
  }

  private sortRowsByFieldNumber(fieldname: string, reverseOrder: boolean): Array<GridRow> {
    // todo: remove all folders from the gridrows, add them to a second array, sort the two arrays, then combine them,
    // so that folders stay at the top
    let gridRows = this._gridRows.sort((firstArg, secondArg) => {
      const a = firstArg.data[fieldname];
      const b = secondArg.data[fieldname];
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      else {
        if (a === b) {
          return 0;
        } else {
          return a < b ? -1 : 1;
        }
      }
    });
    if (reverseOrder) {
      gridRows = gridRows.reverse();
    }
    return gridRows;
  }

  private deselectAll() {
    for (let row of this._gridRows) {
      row.selected = false;
    }
  }

  private unfocus() {
    for (let row of this._gridRows) {
      row.focused = false;
    }
  }

  private tableRowClick(gridRow: GridRow, e: MouseEvent) {
    const currentIndex = this.getRowIndex(this.getFocusedRow());
    const newIndex = this.getRowIndex(gridRow);
    // The grid needs to be focused in order to make cursor navigation work
    this._domNode.focus();
    if (!this._ctrlPressed) {
      this.deselectAll();
      this.unfocus();
    }
    if (this._shiftPressed) {
      if (currentIndex < newIndex) {
        for (let i = currentIndex; i <= newIndex; i++) {
          this._gridRows[i].selected = true;
        }
        this._gridRows[newIndex].focused = true;
      } else if (currentIndex > newIndex) {
        for (let i = currentIndex; i >= newIndex; i--) {
          this._gridRows[i].selected = true;
        }
        this._gridRows[newIndex].focused = true;
      }
    }
    gridRow.focused = true;
  }

  private tableRowDblClick(gridRow: GridRow, e: MouseEvent) {
    this.openDirectory(gridRow);
  }

  private openDirectory(gridRow: GridRow) {
    const model = gridRow.data.model;
    if (!model.isDirectory) {
      return;
    }
    if (model.filename === Constants.UP_REFERENCE) {
      this._currentRoot = model.parent.parent;
    } else {
      this._currentRoot = model;
    }
    this.refreshHtml();
  }

  public get eventTypes() : EventType[] {
    return this._eventTypes;
  }
  

  public getDomNode(): HTMLTableElement {
    return this._domNode;
  }

  public getSelectedFilenames(): Array<string> {
    const result = [];
    this._gridRows.forEach(element => {
      if (element.selected) {
        // todo: replace array with properties
        result.push(element.data.filename);
      }
    });
    return result;
  }
}
