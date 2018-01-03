import { GridColumnConfig } from './gridColumn';
export class GridColumnBuilder {
  private _gridColumn: GridColumnConfig;
  constructor() {
    this._gridColumn = new GridColumnConfig();
  }

  public setTitle(title: string): GridColumnBuilder {
    this._gridColumn.title = title;
    return this;
  }

  public setWidth(width: number): GridColumnBuilder {
    this._gridColumn.width = width + 'px';
    return this;
  }

  public setSortable(sortable: boolean): GridColumnBuilder {
    this._gridColumn.sortable = sortable;
    return this;
  }

  public setIsFirst(value: boolean): GridColumnBuilder {
    this._gridColumn.isFirst = value;
    return this;
  }

  public setIsLast(value: boolean): GridColumnBuilder {
    this._gridColumn.isLast = value;
    return this;
  }

  public setPropertyName(value: string): GridColumnBuilder {
    this._gridColumn.fieldname = value;
    return this;
  }

  public build(): GridColumnConfig {
    return this._gridColumn;
  }
}