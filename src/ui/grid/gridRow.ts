import { GridConfig } from './gridConfig';
import { GridRowValues } from '../../helper/wrapper';
import { FileType } from '../../enum';
import { ViewElement } from '../viewElement';

export class GridRow extends ViewElement {

  private _archiveEntry: GridRowValues;
  private _gridConfig: GridConfig;
  private _selected: boolean;
  private _focused: boolean;
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
    // Only apply the selected css if the row is not focused
    if (value && !this._focused) {
      this.domNode.classList.add('row-selected');
    } else if (!value) {
      this.domNode.classList.remove('row-selected');
    }
  }

  get focused(): boolean {
    return this._focused;
  }

  set focused(value: boolean) {
    this._focused = value;
    if (value) {
      this.domNode.classList.add('row-focused');
      // A focused row is also a selected row
      this.selected = true;
    } else {
      this.domNode.classList.remove('row-focused');
      if (this._selected) {
        // Since we don't add the row-selected class to a focused row
        // we have to make sure a selected row get's the class after losing focus
        this.domNode.classList.add('row-selected');
      }
    }
  }
}