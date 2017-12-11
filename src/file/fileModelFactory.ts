import { FileModel, FileModelBuilder } from './fileModel';
import { Constants } from '../constants';
import { FileType } from '../enum';

export class FileModelFactory {

  private readonly IDX_TIMESTAMP: number = 0;
  private readonly IDX_ATTRIBUTE: number = 1;
  private readonly IDX_SIZE: number = 2;
  private readonly IDX_COMPRESSED_SIZE: number = 3;
  private readonly IDX_NAME: number = 4;
  private readonly ATTR_DIRECTORY = 'D';

  public createFileModel(lines: string[]): FileModel {
    let root = new FileModel();
    for (let line of lines) {
      const lineArray = this.parseLine(line);
      const name = lineArray[this.IDX_NAME];
      if (name.indexOf(Constants.PATH_SEPARATOR()) > -1) {
        const pathParts = name.split(Constants.PATH_SEPARATOR());
        this.createDeepFileModel(root, pathParts, lineArray);
      } else {
        root.children.push(this.buildModel(lineArray, root));
      }
    }
    return root;
  }

  private buildModel(lineArray: Array<string>, parent: FileModel): FileModel {
    const time = lineArray[this.IDX_TIMESTAMP];
    const attr = lineArray[this.IDX_ATTRIBUTE];
    const size = parseInt(lineArray[this.IDX_SIZE]);
    const cSize = parseInt(lineArray[this.IDX_COMPRESSED_SIZE]);
    const name = lineArray[this.IDX_NAME];
    const builder = new FileModelBuilder();
    return builder.attribute(this.attr2FileType(attr)).timestamp(time)
      .size(size).compressedSize(cSize).name(name).parent(parent).build();
  }

  private attr2FileType(attr: string) {
    if (attr === this.ATTR_DIRECTORY) {
      return FileType.DIRECTORY;
    }
    return FileType.FILE;
  }

  /**
   * Checks if "currentNode" already contains a childnode of the name "currentPart".
   */
  private containsPart(currentNode: FileModel, currentPart: string): FileModel {
    for (let child of currentNode.children) {
      if (child.filename === currentPart) {
        return child;
      }
    }
    return void 0;
  }

  private createDeepFileModel(currentNode: FileModel, pathParts: Array<string>,
    lineArray: Array<string>) {
    const currentPart = pathParts[0];
    const remainingParts = pathParts.slice(1, pathParts.length);
    const child = this.containsPart(currentNode, currentPart);
    if (child) {
      this.createDeepFileModel(child, remainingParts, lineArray);
    } else {
      const builder = new FileModelBuilder();
      if (this.upReferenceMissing(currentNode)) {
        currentNode.children.push(this.createUpReference(currentNode));
      }
      currentNode.children.push(builder.name(currentPart).parent(currentNode).build());
    }
  }

  /**
   * Checks if the current node in the file tree already contains
   * a reference to the parent directory.
   */
  private upReferenceMissing(currentNode: FileModel): boolean {
    for (let child of currentNode.children) {
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