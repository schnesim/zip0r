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

export class Grid {

  private _domNode: HTMLTableElement;
  private _tableHead: HTMLTableSectionElement;
  private _tableHeaderRow: HTMLTableRowElement;
  private _gridHeaderRow: Array<HeaderCell>
  private _gridRows: Array<GridRow>;
  private _gridConfig: GridConfig;
  private _columnCount: number;
  private _archivePath: string;
  private _currentRoot: FileModel;
  private _archiveContent: FileModel;
  private _zipController: ZipController;
  private _ctrlPressed: boolean = false;
  private _shiftPressed: boolean = false;

  constructor(gridConfig: GridConfig) {
    this._gridConfig = gridConfig;
    this._gridRows = [];
    this._gridHeaderRow = [];
    this._zipController = new ZipController();
    this._tableHeaderRow = this.createTableHeaderRow(gridConfig);

    this._tableHead = document.createElement('thead');
    this._tableHead.appendChild(this._tableHeaderRow);

    this._domNode = document.createElement('table');
    this._domNode.id = 'grid';
    this._domNode.classList.add('table');
    this._domNode.appendChild(this._tableHead);
    this._domNode.tabIndex = 0; // https://stackoverflow.com/questions/887551/how-can-i-trigger-an-onkeydown-event-on-html-table-on-firefox
    this._domNode.addEventListener('keydown', this.gridKeyDownHandler.bind(this));
    this._domNode.addEventListener('keyup', this.gridKeyUpHandler.bind(this));
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
    for (var index = 0; index < gridConfig.getColumnsConfig().length; index++) {
      var columnConfig = gridConfig.getColumnsConfig()[index];
      const isFirst = index === 0;
      const isLast = index === gridConfig.getColumnsConfig().length - 1;
      const headerCell = new HeaderCell(columnConfig, columnCount);
      headerCell.registerCallback(new Callback(CallbackType.HEADER_CLICK, this.headerCellClickCallback.bind(this)));
      headerCell.registerCallback(new Callback(CallbackType.HEADER_RESIZE, this.headerCellResizeCallback.bind(this)));
      result.appendChild(headerCell.domNode);
      columnCount++;
    }
    return result;
  }

  private headerCellResizeCallback() {
    
  }

  private headerCellClickCallback(event: HeaderCellClickEvent) {
    this.resetSortIcon();
    this._gridRows = this.sortRowsByFieldNumber(event.fieldname, event.reverseOrder);
    this.refresh();
  }

  private resetSortIcon() {
    this._gridHeaderRow.forEach(row => {
      row.resetSortIcon();
    })
  }

  /**
   * The grid gets populated upen setting of the archive path
   */
  set archivePath(value: string) {
    this._gridRows = [];
    this._archivePath = value;
    this._archiveContent = this._zipController.openArchive(value);
    this._currentRoot = this._archiveContent;
    this._currentRoot.children.forEach(child => {
      const values = new GridRowValues(child);
      const row = new GridRow(values, this._gridConfig, this._gridRows.length);
      this._gridRows.push(row);
    })
    this.refresh();
  }

  private refresh() {
    this._domNode.innerHTML = '';
    // this._gridRows = [];
    this._domNode.appendChild(this._tableHead);
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
    this.refresh();
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
