export class FileModel {

  private _timestamp: string;
  private _attribute: string;
  private _size: number;
  private _compressedSize: number;
  private _name: string;
  private _children: Array<FileModel>;
  //private _parent: FileModel;

  constructor(timestamp: string, attribute: string, size: number, compressedSize: number, name: string) {
    this._timestamp = timestamp;
    this._attribute = attribute;
    this._size = size;
    this._compressedSize = isNaN(compressedSize) ? 0 : compressedSize;
    this._name = name;
    this._children = [];
  }

  get timestamp(): string {
    return this._timestamp;
  }

  get attribute(): string {
    return this._attribute;
  }

  get size(): number {
    return this._size;
  }

  get compressedSize(): number {
    return this._compressedSize;
  }

  get name(): string {
    return this._name;
  }

  get children(): Array<FileModel> {
    return this._children;
  }

}