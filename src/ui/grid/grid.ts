import { ViewElement } from '../viewElement'

export class Grid {

  private _domNode: HTMLTableElement;
  private _tableHead: HTMLTableSectionElement;
  private _tableHeaderRow: HTMLTableRowElement;
  // private _tableHeaderCells: Array<HTMLTableHeaderCellElement>;
  // private _data: Array<HTMLTableRowElement>;
  private _gridRows: Array<GridRow>;
  private _gridConfig: GridConfig;
  private _columnCount: number;
  private _rowCount: number;

  constructor(gridConfig: GridConfig) {
    this._gridConfig = gridConfig;
    this._columnCount = 0;
    this._rowCount = 0;
    this._gridRows = [];
    this._domNode = document.createElement('table');
    this._domNode.classList.add('table');
    this._tableHead = document.createElement('thead');
    this._tableHeaderRow = document.createElement('tr');

    for (let column of gridConfig.getColumns()) {
      this._tableHeaderRow.appendChild(this.addTableHeaderCell(column, this._columnCount));
      this._columnCount++;
    }

    this._tableHead.appendChild(this._tableHeaderRow);
    this._domNode.appendChild(this._tableHead);
  }

  private addTableHeaderCell(column: GridColumn, colNumber: number): HTMLTableHeaderCellElement {
    let header = document.createElement('th');
    header.textContent = column.getTitle();
    header.style.width = column.getWidth() + 'px';
    header.setAttribute('colNumber', String(colNumber));
    header.addEventListener('click', this.tableHeaderCellClick.bind(this));
    return header;
  }

  private tableHeaderCellClick(e: MouseEvent) {
    const colNumber = e.srcElement.getAttribute('colNumber');

  }

  private tableRowClick(e: MouseEvent) {

  }

  public addRow(rowData: Array<any>) {
    const gridRow = new GridRow(rowData, this._gridConfig, this._rowCount);
    this._domNode.appendChild(gridRow.getDomNode());
    this._gridRows.push(gridRow);
    this._rowCount++;
  }

  public getDomNode(): HTMLTableElement {
    return this._domNode;
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

  private _data: Array<any>;
  private _gridConfig: GridConfig;

  constructor(data: Array<any>, config: GridConfig, rowCount: number) {
    super();
    this._data = data;
    this._gridConfig = config;
    const row = document.createElement('tr');
    row.classList.add('row');
    //row.addEventListener('click', this.tableRowClick.bind(this));
    row.setAttribute('rowNumber', String(rowCount));
    this.setDomNode(document.createElement('tr'));
    for (var index = 0; index < data.length; index++) {
      const td = document.createElement('td');
      td.style.width = this._gridConfig.getColumns()[index].getWidth() + 'px';
      td.classList.add('data');
      td.innerText = data[index];
      this.getDomNode().appendChild(td);
    }
  }
}

export class GridColumn {

  private _title: string;
  private _width: number;

  /**
   * 
   * @param title The Header of the column
   * @param width The width of the column in pixels 
   */
  constructor(title: string, width: number) {
    this._title = title;
    this._width = width;
  }
  public getTitle(): string {
    return this._title;
  }
  public getWidth(): number {
    return this._width;
  }
}
