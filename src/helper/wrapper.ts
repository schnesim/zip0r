import { EntryType } from '../enum'

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

export class ArchiveEntry {
  public filename: string;
  public size: number;
  public compressedSize: number;
  public type: EntryType;
  constructor(filename: string, size, compressedSize: number) {
    this.filename = filename;
    this.size = size;
    this.compressedSize = compressedSize;
  }
}