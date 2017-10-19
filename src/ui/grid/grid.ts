import { ViewElement } from '../viewElement'

export class Grid {

  private _domNode: HTMLTableElement;
  private _tableHead: HTMLTableSectionElement;
  private _tableHeaderRow: HTMLTableRowElement;
  private _gridRows: Array<GridRow>;
  private _gridConfig: GridConfig;
  private _columnCount: number;
  private _rowCount: number;

  constructor(gridConfig: GridConfig) {
    this._gridConfig = gridConfig;
    this._rowCount = 0;
    this._gridRows = [];
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
    for (let column of gridConfig.getColumns()) {
      result.appendChild(this.createTableHeaderCell(column, columnCount));
      columnCount++;
    }
    return result;
  }

  private createTableHeaderCell(column: GridColumn, colNumber: number): HTMLTableHeaderCellElement {
    const header = document.createElement('th');
    header.className = 'header-cell';
    header.textContent = column.title;
    header.style.width = column.width;
    if (column.sortable) {
      let sortIcon = document.createElement('img');
      sortIcon.src = './ui/grid/arrow-down.svg';
      sortIcon.className = 'sort-icon';
      header.appendChild(sortIcon);
    }
    header.setAttribute('colNumber', String(colNumber));
    header.addEventListener('click', this.tableHeaderCellClick.bind(this));
    return header;
  }

  private tableHeaderCellClick(e: MouseEvent) {
    const colNumber = parseInt(e.srcElement.getAttribute('colNumber'));
    this._gridRows = this.sortRowsByFieldNumber(colNumber);
    this.refresh();
  }

  private refresh() {
    while (this._domNode.firstChild) {
      this._domNode.removeChild(this._domNode.firstChild);
    }
    this._gridRows.forEach(row => {
      this._domNode.appendChild(row.domNode);
    });
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

  private tableRowClick(gridRow: GridRow, e: MouseEvent) {
    console.log(gridRow);
  }

  public addRow(rowData: Array<any>) {
    const gridRow = new GridRow(rowData, this._gridConfig, this._rowCount);
    gridRow.domNode.addEventListener('click', this.tableRowClick.bind(this, gridRow));
    this._domNode.appendChild(gridRow.domNode);
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
    row.setAttribute('rowNumber', String(rowCount));
    this.domNode = row;
    for (var index = 0; index < data.length; index++) {
      const td = document.createElement('td');
      td.style.width = this._gridConfig.getColumns()[index].width;
      td.classList.add('data');
      td.innerText = data[index];
      this.domNode.appendChild(td);
    }
  }

  get data(): Array<any> {
    return this._data;
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
