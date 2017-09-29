export class Grid {

  private _domNode: HTMLTableElement;
  private _tableHead: HTMLTableSectionElement;
  private _tableHeaderRow: HTMLTableRowElement;
  // private _tableHeaderCells: Array<HTMLTableHeaderCellElement>;
  private _data: Array<HTMLTableRowElement>;
  private _gridConfig: GridConfig;
  
  constructor(gridConfig: GridConfig) {
    this._gridConfig = gridConfig;
    this._domNode = document.createElement('table');
    this._tableHead = document.createElement('thead');
    this._tableHeaderRow = document.createElement('tr');

    for (let column of gridConfig.getColumns()) {
      this._tableHeaderRow.appendChild(this.addTableHeaderCell(column));
    }

    this._tableHead.appendChild(this._tableHeaderRow);
    this._domNode.appendChild(this._tableHead);
    // let th1 = document.createElement('th');
    // th1.textContent = 'Header';

    // let row2 = document.createElement('tr');
    // let td1 = document.createElement('td');
    // td1.textContent = 'td1';
    // let td2 = document.createElement('td');
    // td2.textContent = 'td2';
    
    // let tbody = document.createElement('tbody');
    
    // this._domNode.appendChild(this._tableHead);
    // this._tableHead.appendChild(row);
    // row.appendChild(th1); 
    // this._domNode.appendChild(tbody);
    // tbody.appendChild(row2);
    // row2.appendChild(td2);
  }

  private addTableHeaderCell(column: GridColumn): HTMLTableHeaderCellElement {
    let header = document.createElement('th');
    header.textContent = column.getTitle();
    header.style.width = column.getWidth() + 'px';
    return header;
  }

  public addRow(rowData: Array<any>): HTMLTableRowElement {
    const row = document.createElement('tr');
    for (var index = 0; index < rowData.length; index++) {
      const td = document.createElement('td');
      td.style.width = this._gridConfig.getColumns()[index].getWidth() + 'px';
      td.innerText = rowData[index];
      row.appendChild(td);
    }
    return row;
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
