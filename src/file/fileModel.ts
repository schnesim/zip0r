import { FileType } from "../enum";

export class FileModel {

  private _timestamp: string;
  private _fileType: FileType;
  private _size: number;
  private _compressedSize: number;
  private _filename: string;
  private _isDirectory: boolean;
  private _parent: FileModel;
  private _children: Array<FileModel>;

  constructor() {
    this._children = [];
  }

  public get timestamp(): string {
    return this._timestamp;
  }

  public set timestamp(value: string) {
    this._timestamp = value;
  }

  public get fileType(): FileType {
    return this._fileType;
  }

  public set fileType(value: FileType) {
    this._fileType = value;
  }

  public get size(): number {
    return this._size;
  }

  public set size(value: number) {
    this._size = value;
  }

  public get compressedSize(): number {
    return this._compressedSize;
  }

  public set compressedSize(value: number) {
    this._compressedSize = value;
  }

  public get filename(): string {
    return this._filename;
  }

  public set filename(value: string) {
    this._filename = value;
  }

  public get isDirectory(): boolean {
    return this._isDirectory;
  }

  public set isDirectory(value: boolean) {
    this._isDirectory = value;
  }

  public get parent(): FileModel {
    return this._parent;
  }
  
  public set parent(value: FileModel) {
    this._parent = value;
  }

  public get children(): Array<FileModel> {
    return this._children;
  }
}

export class FileModelBuilder {
  private _fileModel: FileModel

  constructor() {
    this._fileModel = new FileModel();
  }

  public timestamp(value: string) {
    this._fileModel.timestamp = value;
    return this;
  }
  
  public attribute(value: string) {
    this._fileModel.fileType = value;
    this._fileModel.isDirectory = value === 'D';
    return this;
  }
  
  public size(value: number) {
    this._fileModel.size = value;
    return this;
  }
  
  public compressedSize(value: number) {
    this._fileModel.compressedSize = value;
    return this;
  }
  
  public name(value: string) {
    this._fileModel.filename = value;
    return this;
  }

  public child(value: FileModel) {
    this._fileModel.children.push(value);
    return this;
  }

  public build() {
    return this._fileModel;
  }
}