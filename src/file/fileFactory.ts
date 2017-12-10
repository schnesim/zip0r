import * as path from 'path';
import { FileModel, FileModelBuilder } from './fileModel';
import { Constants } from '../constants';

export class FileModelFactory {

  private readonly IDX_TIMESTAMP: number = 0;
  private readonly IDX_ATTRIBUTE: number = 1;
  private readonly IDX_SIZE: number = 2;
  private readonly IDX_COMPRESSED_SIZE: number = 3;
  private readonly IDX_NAME: number = 4;

  public createFileModel(lines: string[]): FileModel {
    let rootFileModel = new FileModel();
    for (let line of lines) {
      const lineArray = this.parseLine(line);
      const name = lineArray[this.IDX_NAME];
      if (name.indexOf(Constants.PATH_SEPARATOR) > -1) {
        const pathParts = name.split(Constants.PATH_SEPARATOR);
        this.createDeepFileModel(rootFileModel, pathParts, lineArray);
      } else {
        rootFileModel.children.push(this.buildModel(lineArray));
      }
    }
    return rootFileModel;
  }

  private buildModel(lineArray: Array<string>): FileModel {
    const time = lineArray[this.IDX_TIMESTAMP];
    const attr = lineArray[this.IDX_ATTRIBUTE];
    const size = parseInt(lineArray[this.IDX_SIZE]);
    const cSize = parseInt(lineArray[this.IDX_COMPRESSED_SIZE]);
    const name = lineArray[this.IDX_NAME];
    const builder = new FileModelBuilder();
    return builder.attribute(attr).timestamp(time).size(size).compressedSize(cSize).name(name).build();
  }

  private containsPart(parent: FileModel, firstPart: string): FileModel {
    for (let child of parent.children) {
      if (child.filename === firstPart) {
        return child;
      }
    }
    return void 0;
  }

  private createDeepFileModel(parent: FileModel, pathParts: Array<string>, lineArray: Array<string>) {
    const currentPart = pathParts[0];
    const remainingParts = pathParts.slice(1, pathParts.length);
    const child = this.containsPart(parent, currentPart);
    if (child) {
      this.createDeepFileModel(child, remainingParts, lineArray);
    } else {
      const builder = new FileModelBuilder();
      if (this.upReferenceMissing(parent)) {
        parent.children.push(this.createUpReference(parent));
      }
      parent.children.push(builder.name(currentPart).build());
    }
  }

  private upReferenceMissing(parent: FileModel): boolean {
    for (let child of parent.children) {
      if (child.filename === Constants.UP_REFERENCE) {
        return false;
      }
    }
    return true;
  }

  private createUpReference(parent: FileModel): FileModel {
    const model = new FileModel();
    model.filename = Constants.UP_REFERENCE;
    model.parent = parent;
    return model;
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