export class HeaderCellClickEvent {
  private _fieldname: string;
  private _reverseOrder: boolean;
  constructor(fieldname: string, reverseOrder: boolean) {
    this._fieldname = fieldname;
    this._reverseOrder = reverseOrder;
  }
  public get fieldname(): string {
    return this._fieldname;
  }
  public get reverseOrder(): boolean {
    return this._reverseOrder;
  }
}