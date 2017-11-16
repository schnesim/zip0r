import * as path from 'path';
import { FileModel } from './fileModel';

export class FileModelFactory {

    private readonly IDX_TIMESTAMP: number = 0;
    private readonly IDX_ATTRIBUTE: number = 1;
    private readonly IDX_SIZE: number = 2;
    private readonly IDX_COMPRESSED_SIZE: number = 3;
    private readonly IDX_NAME: number = 4;

    public createFileModel(line: string): FileModel {
        const lineArray = this.parseLine(line);
        const time = lineArray[this.IDX_TIMESTAMP];
        const attr = lineArray[this.IDX_ATTRIBUTE];
        const size = parseInt(lineArray[this.IDX_SIZE]);
        const cSize = parseInt(lineArray[this.IDX_COMPRESSED_SIZE]);
        const name = lineArray[this.IDX_NAME];
        let result = void 0;
        if (name.indexOf(path.delimiter) > -1) {
            const pathParts = name.split(path.delimiter).reverse();
            result = this.createDeepFileModel(time, attr, size, cSize, pathParts);
        } else {
            
            result = new FileModel(lineArray[0], lineArray[1], parseInt(lineArray[2]), parseInt(lineArray[3]), lineArray[4]);
        }
        return result;
    }
    
    private createDeepFileModel(time: string, attr: string, size: number, cSize: number, pathParts: Array<string>): FileModel {
        console.log(pathParts);
        const result = new FileModel(time, attr, size, cSize, pathParts.pop());
        if (pathParts.length > 0) {
            result.children.push
        }
        return result;
    }

    private parseLine(line): Array<string> {
        let s = line;//'2017-09-13 09:58:58 ....A          650          459  package.json'
        const lines = [];
        lines.push(s.substr(0, 19));                    // timestamp
        lines.push(s.substr(20, 5).replace(/\./g, '')); // attribute
        lines.push(s.substr(26, 12).trim());            // size
        lines.push(s.substr(39, 12).trim());            // compressed size
        lines.push(s.substr(53, s.length));             // name
        return lines;
    }
}