import { GridColumnConfig } from './gridColumn';
export class GridColumnFactory {
  private _gridColumn: GridColumnConfig;
  constructor() {
    this._gridColumn = new GridColumnConfig();
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

  public setIsFirst(value: boolean): GridColumnFactory {
    this._gridColumn.isFirst = value;
    return this;
  }

  public setIsLast(value: boolean): GridColumnFactory {
    this._gridColumn.isLast = value;
    return this;
  }

  public setFieldName(value: string): GridColumnFactory {
    this._gridColumn.fieldname = value;
    return this;
  }

  public build(): GridColumnConfig {
    return this._gridColumn;
  }
}