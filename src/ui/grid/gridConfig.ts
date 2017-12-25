import { GridColumnConfig } from './gridColumn';
export class GridConfig {

  private _columns: Array<GridColumnConfig>;

  constructor() {
    this._columns = [];
  }

  public addColumn(column: GridColumnConfig) {
    this._columns.push(column);
  }

  public getColumnsConfig(): Array<GridColumnConfig> {
    return this._columns;
  }
}