export class Grid {
  private _domNode: HTMLTableElement;
  private _head: HTMLTableSectionElement;
  constructor(gridConfig: GridConfig) {
    this._domNode = document.createElement('table');
    this._head = document.createElement('thead');
    let row = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.textContent = 'Header';

    let row2 = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.textContent = 'td1';
    let td2 = document.createElement('td');
    td2.textContent = 'td2';
    
    let tbody = document.createElement('tbody');
    
    this._domNode.appendChild(this._head);
    this._head.appendChild(row);
    row.appendChild(th1); 
    this._domNode.appendChild(tbody);
    tbody.appendChild(row2);
    row2.appendChild(td2);
  }

  private addRow(rowParent: HTMLTableSectionElement) {
    const row = document.createElement('tr');

  }

  public getDomNode(): HTMLTableElement {
    return this._domNode;
  }
}

export class GridConfig {
  constructor() {

  }

  public addColumn() {

  }
}

export class GridColumn {

}