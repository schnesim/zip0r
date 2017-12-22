import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { remote } from 'electron';

import { FileModelFactory } from '../file/fileModelFactory'
import { FileModel } from '../file/fileModel'
import { Result } from '../enum'
import { ExtractWrapper } from '../helper/wrapper';
import { Constants, Platform } from '../constants';

export class ZipController {

  private _fileFactory: FileModelFactory;
  private _7zPath: string;

  constructor() {
    this._fileFactory = new FileModelFactory();
    if (Platform.isDarwin()) {
      if (process.env.NODE_ENV === 'development') {
        this._7zPath = 'lib/darwin/7z/7z';
      } else {
        this._7zPath = process.resourcesPath + '/lib/darwin/7z/7z';
      }
    }
    if (Platform.isWin32()) {
      this._7zPath = 'lib/win32/7z/7z.exe';
    }
  }

  public extractFiles(wrapper: ExtractWrapper) {
    const process = child_process.spawnSync(this._7zPath,
      ['e', wrapper.archivePath, '-o' + wrapper.destDir, wrapper.filePaths.join(' ')],
      { encoding: 'utf8' });

    console.log(process.error)
    const out = process.stdout;
    const tmpResult = this.parseExtractFlatFile(out);
    // todo: might be wise to check for existing files before starting the extraction
    if (tmpResult === Result.OVERWRITE) {
      remote.dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No', 'Cancel'],
        message: 'Overwrite existing files?'
      }, this.extractFilesOverwrite.bind(this, wrapper));
    }
    console.log(out)
  }

  private extractFilesOverwrite(wrapper: ExtractWrapper, btnIndex: number) {
    if (btnIndex === 0) {
      const process = child_process.spawnSync(this._7zPath,
        ['e', wrapper.archivePath, '-o' + wrapper.destDir, wrapper.filePaths.join(' '), '-aoa'],
        { encoding: 'utf8' });
      console.log(process.stdout);
    } else if (btnIndex === 1) {
      const process = child_process.spawnSync(this._7zPath,
        ['e', wrapper.archivePath, '-o' + wrapper.destDir, wrapper.filePaths.join(' '), '-aos'],
        { encoding: 'utf8' });
      console.log(process.stdout);
    }
  }

  public openArchive(path: string): FileModel {
    const childProcess = child_process.spawnSync(this._7zPath, ['l', path], { encoding: 'utf8' });
    const out = childProcess.stdout;
    console.log(out)
    const rootFileModel = this.parseContentFlatFile(out);
    return rootFileModel;
  }

  public createZipFile(folder: string) {
    const process = child_process.spawn('lib/darwin/7z/7za',
      ['a', '/Volumes/RamDisk/test', '/Volumes/RamDisk/Cache']);
    // For asynchronous processes the encoding has to be set afterwards
    process.stdout.setEncoding('utf8');
    process.stderr.setEncoding('utf8');
    process.stdout.on('data', (data) => {
      console.log('data: ' + data);
    });
    process.stderr.on('data', (data) => {
      console.log('error: ' + data)
    })
  }

  private parseExtractFlatFile(flatFile: string): Result {
    if (flatFile.indexOf('already exists') > -1) {
      return Result.OVERWRITE;
    }
    return Result.SUCESS;
  }

  private parseContentFlatFile(flatFile: string): FileModel {
    let s = '';
    s = flatFile;
    const lines = s.split(os.EOL);
    const type = this.extractType(lines);
    const fileLines = [];
    let index = this.getStartIndexOfArchiveContent(type, os.platform());
    for (; index < lines.length; index++) {
      if (lines[index] === '------------------- ----- ------------ ------------  ------------------------') {
        break;
      }
      fileLines.push(lines[index]);
    }
    index++;
    const summary = lines[index];
    const rootFileModel = this._fileFactory.createFileModel(fileLines);
    return rootFileModel;
  }

  private extractType(fileLines: Array<string>): string {
    let result = '';
    for (let line of fileLines) {
      if (line.startsWith('Type')) {
        result = line.substr(7);
        break;
      }
    }
    return result;
  }

  /**
   * This function returns the line index of the archive's content, since the index
   * is not the same across all archive types 7z can handle.
   * @param type Archive type (7zip, zip...)
   * @param platform The OS the application is running on
   */
  private getStartIndexOfArchiveContent(type: string, platform: string): number {
    switch (platform) {
      case 'win32':
        if (type === 'zip') {
          return 15;
        } else if (type === '7z') {
          return 19;
        }
      default:
        return 17;
    }
  }
}