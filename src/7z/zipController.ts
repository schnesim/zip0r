import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { remote } from 'electron';

import { FileFactory } from '../file/fileFactory'
import { FileModel } from '../file/fileModel'
import { Result } from '../enum'
import { ExtractWrapper } from '../helper/wrapper';

export class ZipController {

    private _fileFactory: FileFactory;
    private _7zPath: string;

    constructor() {
        this._fileFactory = new FileFactory();
        if (os.platform() === 'darwin') {
            this._7zPath = 'lib/darwin/7z/7za';
        }
        if (os.platform() === 'win32') {
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

    public listArchiveContent(path: string): Array<FileModel> {
        const process = child_process.spawnSync(this._7zPath, ['l', path], { encoding: 'utf8' });
        const files = this.parseContentFlatFile(process.stdout);
        return files;
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

    private parseContentFlatFile(flatFile: string): Array<FileModel> {
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