import { ViewElement } from '../viewElement'
import { ViewEventEmitter } from '../viewEventEmitter';
import { GridRowValues } from '../../helper/wrapper';
import { ZipController } from '../../7z/zipController';
import { FileModel } from '../../file/fileModel';
import { Constants } from '../../constants';

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

  constructor(gridConfig: GridConfig) {
    this._gridConfig = gridConfig;
    this._gridRows = [];
    this._gridHeaderRow = [];
    this._zipController = new ZipController();
    this._tableHeaderRow = this.createTableHeaderRow(gridConfig);

    this._tableHead = document.createElement('thead');
    this._tableHead.appendChild(this._tableHeaderRow);

    this._domNode = document.createElement('table');
    this._domNode.classList.add('table');
    this._domNode.appendChild(this._tableHead);
  }

  private createTableHeaderRow(gridConfig: GridConfig): HTMLTableRowElement {
    const result = document.createElement('tr');
    result.className = 'header';
    let columnCount = 0;
    for (var index = 0; index < gridConfig.getColumns().length; index++) {
      var column = gridConfig.getColumns()[index];
      const headerCell = new HeaderCell(index === 0, index === gridConfig.getColumns().length - 1, column, columnCount);
      result.appendChild(headerCell.domNode);
      columnCount++;
    }
    return result;
  }

  /**
   * The grid gets populated upen setting of the archive path
   */
  set archivePath(value: string) {
    this._gridRows = [];
    this._archivePath = value;
    this._archiveContent = this._zipController.openArchive(value);
    this._currentRoot = this._archiveContent;
    this.refresh();
  }

  private refresh() {
    this._domNode.innerHTML = '';
    this._gridRows = [];
    this._domNode.appendChild(this._tableHead);
    this._currentRoot.children.forEach(entry => {
      const values = new GridRowValues(entry);
      const row = new GridRow(values, this._gridConfig, this._gridRows.length);
      row.domNode.addEventListener('click', this.tableRowClick.bind(this, row));
      row.domNode.addEventListener('dblclick', this.tableRowDblClick.bind(this, row));
      this._domNode.appendChild(row.domNode);
      this._gridRows.push(row);
    })
  }

  private sortRowsByFieldNumber(n: number): Array<GridRow> {
    return this._gridRows.sort((firstArg, secondArg) => {
      const a = firstArg.data[n];
      const b = secondArg.data[n];
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
  }

  private deselectAll() {
    for (let row of this._gridRows) {
      row.selected = false;
    }
  }

  private tableRowClick(gridRow: GridRow, e: MouseEvent) {
    console.log(gridRow);
    this.deselectAll();
    gridRow.selected = true;
  }

  private tableRowDblClick(gridRow: GridRow, e: MouseEvent) {
    const model = gridRow.data.model;
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
        result.push(element.data[0]);
      }
    });
    return result;
  }
}

export class HeaderCell extends ViewElement {

  private _sortIcon: HTMLImageElement;
  private _colNumber: Number;
  private _clickCallback: Function;
  private _mouseoverCallback: Function;
  private _isFirst: boolean;
  private _isLast: boolean;
  private _mouseEnter: boolean;

  constructor(isFirst, isLast, column: GridColumn, colNumber: number) {
    super();
    this._isFirst = isFirst;
    this._isLast = isLast;
    this.createHeaderCell(column, colNumber)
  }

  private createHeaderCell(column: GridColumn, colNumber: number) {
    const header = document.createElement('th');
    header.className = 'header-cell';
    header.textContent = column.title;
    header.style.width = column.width;
    if (column.sortable) {
      this._sortIcon = document.createElement('img');
      this._sortIcon.src = './ui/grid/arrow-down.svg';
      this._sortIcon.className = 'sort-icon';
      header.appendChild(this._sortIcon);
    }
    header.setAttribute('colNumber', String(colNumber));
    header.addEventListener('click', this.headerCellClick.bind(this));
    header.addEventListener('mouseenter', this.headerCellMouseEnter.bind(this));
    header.addEventListener('mouseleve', this.headerCellMouseLeave.bind(this));
    header.addEventListener('mousemove', this.headerCellMouseMove.bind(this));
    this.domNode = header;
  }

  public registerHeaderCellClickCallback(callback: Function) {
    this._clickCallback = callback;
  }

  public registerHeaderCellMouseover(callback: Function) {
    this._mouseoverCallback = callback;
  }

  private headerCellMouseEnter(e: MouseEvent) {
    this._mouseEnter = true;
  }

  private headerCellMouseLeave(e: MouseEvent) {
    this._mouseEnter = false;
    this.domNode.style.cursor = 'default';
  }

  private headerCellMouseMove(e: MouseEvent) {
    if (!this._mouseEnter) {
      return;
    }
    const position = this.domNode.getBoundingClientRect();
    // If the cursor is within the first 10% or last 90% of the cell's width, then show the resize cursor.
    // If it's the first/last column, then the resize cursor only get's shown on the right/left side.
    if (this.withinFirstTenPercent(e, position) || this.withinLastTenPercent(e, position)) {
      this.domNode.style.cursor = 'ew-resize';
    } else {
      this.domNode.style.cursor = 'default';
    }
  }

  private withinFirstTenPercent(e: MouseEvent, position: ClientRect) {
    const leftBoundary = position.left;
    const rightBoundary = position.left + 5;
    return e.screenX >= leftBoundary && e.screenX <= rightBoundary && !this._isFirst;
  }

  private withinLastTenPercent(e: MouseEvent, position: ClientRect) {
    const leftBoundary = position.right - 5;
    const rightBoundary = position.right;
    return e.screenX >= leftBoundary && e.screenX <= rightBoundary && !this._isLast;
  }

  private headerCellClick(e: MouseEvent) {
    const colNumber = parseInt(e.srcElement.getAttribute('colNumber'));
    // this._gridRows = this.sortRowsByFieldNumber(colNumber);
    // this.refresh();

    // this.emit(new TableHeaderCellClickEevent());
  }
}

export class GridConfig {

  private _columns: Array<GridColumn>;

  constructor() {
    this._columns = [];
  }

  public addColumn(column: GridColumn) {
    this._columns.push(column);
  }

  public getColumns(): Array<GridColumn> {
    return this._columns;
  }
}

export class GridRow extends ViewElement {

  // private _data: Array<any>;
  private _archiveEntry: GridRowValues;
  private _gridConfig: GridConfig;
  private _selected: boolean;
  private _doubleClickCallback: Function;

  constructor(archiveEntry: GridRowValues, config: GridConfig, rowCount: number) {
    super();
    this._archiveEntry = archiveEntry;
    this._gridConfig = config;
    this.domNode = document.createElement('tr');
    this.domNode.classList.add('row');
    this.domNode.setAttribute('rowNumber', String(rowCount));

    const icon = document.createElement('div');
    icon.classList.add('row-icon');
    icon.classList.add('row-icon-folder');


    const name = document.createElement('div');
    name.className = 'row-entry-name';
    name.innerText = this._archiveEntry.filename;

    const iconAndFilename = document.createElement('td');
    iconAndFilename.addEventListener('dblclick', this.entryDoubleClick.bind(this));
    iconAndFilename.classList.add('data');
    // For unknown reasons, setting td:display:flex causes too wide borders. So we have to use a wrapper
    // to get flex working properly.
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('row-icon-and-filename');
    wrapperDiv.appendChild(icon)
    wrapperDiv.appendChild(name)
    iconAndFilename.appendChild(wrapperDiv);

    this.domNode.appendChild(iconAndFilename);
    this.domNode.appendChild(this.createTableCell(this._archiveEntry.size, this._gridConfig.getColumns()[1].width));
    this.domNode.appendChild(this.createTableCell(this._archiveEntry.compressedSize, this._gridConfig.getColumns()[2].width));
  }

  private entryDoubleClick() {

  }

  private createTableCell(innerText, width: string): HTMLTableDataCellElement {
    const td = document.createElement('td');
    td.style.width = width;
    td.classList.add('data');
    td.innerText = innerText;
    return td;
  }

  public registerCellDoubleClickCallback(callback: Function) {
    this._doubleClickCallback = callback;
  }

  get data(): GridRowValues {
    return this._archiveEntry;
  }

  get selected() {
    return this._selected
  }

  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.domNode.classList.add('row-selected');
    } else {
      this.domNode.classList.remove('row-selected');
    }
  }
}

export class GridColumnFactory {
  private _gridColumn: GridColumn;
  constructor() {
    this._gridColumn = new GridColumn();
  }

  public setTitle(title: string): GridColumnFactory {
    this._gridColumn.title = title;
    return this;
  }

  public setWidth(width: number): GridColumnFactory {
    this._gridColumn.width = width + 'px';
    return this;
  }

  public setSortable(sortable: boolean): GridColumnFactory {
    this._gridColumn.sortable = sortable;
    return this;
  }

  public build(): GridColumn {
    return this._gridColumn;
  }
}

export class GridColumn {
  public title: string;
  public width: string;
  public sortable: boolean = false;
  constructor() { }
}
