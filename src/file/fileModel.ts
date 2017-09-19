export class FileModel {

  private _timestamp: string;
  private _attribute: string;
  private _size: number;
  private _compressedSize: number;
  private _name: string;

  constructor(timestamp: string, attribute: string, size: number, compressedSize: number, name: string) {
    this._timestamp = timestamp;
    this._attribute = attribute;
    this._size = size;
    this._compressedSize = compressedSize;
    this._name = name;
  }

}