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