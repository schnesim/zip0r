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
        let process = void 0;
        if (os.platform() === 'darwin') {
            process = child_process.spawnSync('lib/darwin/7z/7za',
                ['l', path], { encoding: 'utf8' });
        }
        if (os.platform() === 'win32') {
            process = child_process.spawnSync('lib/win32/7za/7za.exe',
                ['l', path], { encoding: 'utf8' });
        }
        const flatFile = process.stdout;
        console.log(flatFile)
        const files = this.parseFlatFile(flatFile);
        return files;
    }

    public createZipFile(folder: string) {
        const process = child_process.spawn('lib/darwin/7z/7za',
            ['a', '/Volumes/RamDisk/test', '/Volumes/RamDisk/Cache']);
        process.stdout.setEncoding('utf8');
        process.stderr.setEncoding('utf8');
        process.stdout.on('data', (data) => {
            console.log('data: ' + data);
        });
        process.stderr.on('data', (data) => {
            console.log('error: ' + data)
        })
    }

    private parseFlatFile(flatFile: string): Array<FileModel> {
        let s = '';
        s = flatFile;
        const lines = s.split(os.EOL);
        const fileLines = [];
        let index = os.platform() === 'win32' ? 19 : 17;
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