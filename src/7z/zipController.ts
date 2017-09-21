import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

import { FileFactory } from '../file/fileFactory'
import { FileModel } from '../file/fileModel'

export class ZipController {

    private _fileFactory: FileFactory;

    constructor() {
        this._fileFactory = new FileFactory();
    }

    public listArchiveContent(path: string): Array<FileModel> {
        const process = child_process.spawnSync('lib/win32/7za/7za.exe',
            ['l', 'zip0r.7z'], { encoding: 'utf8' });
        const flatFile = process.stdout;
        const files = this.parseFlatFile(flatFile);
        console.log(files);
        return files;
    }

    private parseFlatFile(flatFile: string): Array<FileModel> {
        let s = '';
        s = flatFile;
        const lines = s.split(os.EOL);
        const fileLines = [];
        let index = 19;
        for (; index < lines.length; index++) {
            if (lines[index] === '------------------- ----- ------------ ------------  ------------------------') {
                break;
            }
            fileLines.push(lines[index]);
        }
        index++;
        const summary = lines[index];
        const files = [];
        for (let file of fileLines) {
            files.push(this._fileFactory.createFile(file));
        }
        return files;
    }
}