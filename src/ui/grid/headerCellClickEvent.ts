export class HeaderCellClickEvent {
  private _colNumber: number;
  /**
   * 
   * @param colNumber The number of the column whose header cell got clicked.
   */
  constructor(colNumber: number) {
    this._colNumber = colNumber;
  }

  public get colNumber(): number {
    return this._colNumber;
  }
}