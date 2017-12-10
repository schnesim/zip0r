import { FileType } from '../enum'
import { FileModel } from '../file/fileModel';

export class ExtractWrapper {
  public archivePath: string;
  public destDir: string;
  public filePaths: Array<string>;
  constructor(archivePath, destDir: string, filePaths: Array<string>) {
    this.archivePath = archivePath;
    this.destDir = destDir;
    this.filePaths = filePaths;
  }
}

export class GridRowValues {
  private _model: FileModel;
  constructor(model: FileModel) {
    this._model = model;
  }

  public get filename(): string {
    return this._model.filename;
  }

  public get compressedSize(): number {
    return this._model.compressedSize;
  }

  public get size(): number {
    return this._model.size;
  }

  public get type(): FileType {
    return this._model.fileType;
  }

  public get model(): FileModel {
    return this._model;
  }
}