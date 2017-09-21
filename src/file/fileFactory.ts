import { FileModel } from './fileModel';

export class FileFactory {

    public createFile(line): FileModel {
        const lineElements = this.parseLine(line);
        const result = new FileModel(lineElements[0], lineElements[1], lineElements[2], lineElements[3], lineElements[4]);
        return result;
    }

    private parseLine(line): Array<string> {
        let s = line;//'2017-09-13 09:58:58 ....A          650          459  package.json'
        const lines = [];
        lines.push(s.substr(0, 19));                    // timestamp
        lines.push(s.substr(20, 5).replace(/\./g, ''));   // attribute
        lines.push(s.substr(26, 12).trim());            // size
        lines.push(s.substr(39, 12).trim());            // compressed size
        lines.push(s.substr(53, s.length));             // name
        return lines;
    }
}