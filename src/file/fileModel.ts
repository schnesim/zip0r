import { FileType } from "../enum";

export class FileModel {

  private _time: string;
  private _date: string;
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

  public get time(): string {
    return this._time;
  }

  public set time(value: string) {
    this._time = value;
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
    return this._fileType === FileType.DIRECTORY;
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

  public get date(): string {
    return this._date;
  }
  
  public set date(value: string) {
    this._date = value;
  }
}

export class FileModelBuilder {
  private _fileModel: FileModel

  constructor() {
    this._fileModel = new FileModel();
  }

  public time(value: string) {
    this._fileModel.time = value;
    return this;
  }
  
  public attribute(value: FileType) {
    this._fileModel.fileType = value;
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

  public parent(value: FileModel) {
    this._fileModel.parent = value;
    return this;
  }

  public date(value: string) {
    this._fileModel.date = value;
    return this;
  }

  public build() {
    return this._fileModel;
  }
}