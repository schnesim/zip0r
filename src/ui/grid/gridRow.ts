import { GridRowValues } from '../../helper/wrapper';
import { GridConfig } from './grid';
import { FileType } from '../../enum';
import { ViewElement } from '../viewElement';

export class GridRow extends ViewElement {
  
    private _archiveEntry: GridRowValues;
    private _gridConfig: GridConfig;
    private _selected: boolean;
    private _doubleClickCallback: Function;
  
    constructor(archiveEntry: GridRowValues, config: GridConfig, rowCount: number) {
      super();
      this._archiveEntry = archiveEntry;
      this._gridConfig = config;
      this.domNode = document.createElement('tr');
      this.domNode.classList.add('row');
      this.domNode.setAttribute('rowNumber', String(rowCount));
  
      const icon = document.createElement('div');
      icon.classList.add('row-icon');
      if (archiveEntry.type === FileType.DIRECTORY) {
        icon.classList.add('row-icon-folder');
      } else {
        icon.classList.add('row-icon-file');
      }
  
  
      const name = document.createElement('div');
      name.className = 'row-entry-name';
      name.innerText = this._archiveEntry.filename;
  
      const iconAndFilename = document.createElement('td');
      iconAndFilename.addEventListener('dblclick', this.entryDoubleClick.bind(this));
      iconAndFilename.classList.add('data');
      // For unknown reasons, setting td:display:flex causes too wide borders. So we have to use a wrapper
      // to get flex working properly.
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('row-icon-and-filename');
      wrapperDiv.appendChild(icon)
      wrapperDiv.appendChild(name)
      iconAndFilename.appendChild(wrapperDiv);
  
      this.domNode.appendChild(iconAndFilename);
      this.domNode.appendChild(this.createTableCell(this._archiveEntry.size, this._gridConfig.getColumns()[1].width));
      this.domNode.appendChild(this.createTableCell(this._archiveEntry.compressedSize, this._gridConfig.getColumns()[2].width));
    }
  
    private entryDoubleClick() {
  
    }
  
    private createTableCell(innerText, width: string): HTMLTableDataCellElement {
      const td = document.createElement('td');
      td.style.width = width;
      td.classList.add('data');
      td.innerText = innerText;
      return td;
    }
  
    public registerCellDoubleClickCallback(callback: Function) {
      this._doubleClickCallback = callback;
    }
  
    get data(): GridRowValues {
      return this._archiveEntry;
    }
  
    get selected() {
      return this._selected
    }
  
    set selected(value: boolean) {
      this._selected = value;
      if (value) {
        this.domNode.classList.add('row-selected');
      } else {
        this.domNode.classList.remove('row-selected');
      }
    }
  }