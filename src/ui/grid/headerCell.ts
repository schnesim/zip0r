import { HeaderCellClickEvent } from './headerCellClickEvent';
import { IEventListener } from '../../event/event';
import { GridColumnConfig } from './gridColumn';
import { ViewElement } from '../viewElement';
import { Callback, CallbackType } from '../event';
export class HeaderCell extends ViewElement implements IEventListener {

  private _sortIcon: HTMLImageElement;
  private _colNumber: Number;
  private _clickCallback: Function;
  private _mouseoverCallback: Function;
  private _isFirst: boolean;
  private _isLast: boolean;
  private _mouseEnter: boolean;
  private _mouseDown: boolean;
  private _gridColum: GridColumnConfig;
  private _callbacks: Callback[];
  private _reverseOrder: boolean = false;

  constructor(column: GridColumnConfig, colNumber: number) {
    super();
    this._isFirst = column.isFirst;
    this._isLast = column.isLast;
    this._callbacks = [];
    this.createHeaderCell(column, colNumber)
  }

  private createHeaderCell(column: GridColumnConfig, colNumber: number) {
    const header = document.createElement('th');
    header.className = 'header-cell';
    header.textContent = column.title;
    header.style.width = column.width;
    if (column.sortable) {
      this._sortIcon = document.createElement('img');
      this._sortIcon.src = './ui/grid/arrow-down.svg';
      this._sortIcon.className = 'sort-icon';
      this._sortIcon.style.visibility = 'hidden';
      header.appendChild(this._sortIcon);
    }
    header.setAttribute('colNumber', String(colNumber));
    header.setAttribute('fieldname', column.fieldname);
    if (column.sortable) {
      header.addEventListener('click', this.headerCellClick.bind(this));
    }
    header.addEventListener('mouseenter', this.headerCellMouseEnter.bind(this));
    header.addEventListener('mouseleve', this.headerCellMouseLeave.bind(this));
    header.addEventListener('mousemove', this.headerCellMouseMove.bind(this));
    header.addEventListener('mouseup', this.headerCellMouseUp.bind(this));
    this.domNode = header;
  }

  public registerCallback(callback: Callback) {
    this._callbacks.push(callback);
  }

  public resetSortIcon() {
    this._sortIcon.style.visibility = 'hidden';
  }

  fireCallback(type: CallbackType) {
    
  }

  private headerCellMouseDown(e: MouseEvent) {
    this._mouseDown = true;
  }

  private headerCellMouseUp(e: MouseEvent) {
    this._mouseDown = false;
  }

  private headerCellMouseEnter(e: MouseEvent) {
    this._mouseEnter = true;
  }

  private headerCellMouseLeave(e: MouseEvent) {
    this._mouseEnter = false;
    this.domNode.style.cursor = 'default';
  }

  private headerCellMouseMove(e: MouseEvent) {
    if (!this._mouseEnter) {
      return;
    }
    const cellBoundingRect = this.domNode.getBoundingClientRect();
    if (this.withinLeftMargin(e, cellBoundingRect) || this.withinRightMargin(e, cellBoundingRect)) {
      this.domNode.style.cursor = 'ew-resize';
    } else {
      this.domNode.style.cursor = 'default';
    }
  }

  private withinLeftMargin(e: MouseEvent, cellBoundingRect: ClientRect) {
    const leftBoundary = cellBoundingRect.left;
    const rightBoundary = cellBoundingRect.left + 5;
    return e.screenX >= leftBoundary && e.screenX <= rightBoundary && !this._isFirst;
  }

  private withinRightMargin(e: MouseEvent, cellBoundingRect: ClientRect) {
    const leftBoundary = cellBoundingRect.right - 5;
    const rightBoundary = cellBoundingRect.right;
    return e.screenX >= leftBoundary && e.screenX <= rightBoundary && !this._isLast;
  }

  private headerCellClick(e: MouseEvent) {
    this._sortIcon.style.visibility = 'visisble';
    if (this._reverseOrder) {
      this._reverseOrder = !this._reverseOrder;
      this._sortIcon.src = './ui/grid/arrow-down.svg';
    } else {
      this._reverseOrder = !this._reverseOrder;
      this._sortIcon.src = './ui/grid/arrow-up.svg';
    }
    const fieldname = e.srcElement.getAttribute('fieldname');
    this._callbacks.forEach(callback => {
      if (callback.type === CallbackType.CLICK_HEADER) {
        callback.callback(new HeaderCellClickEvent(fieldname, this._reverseOrder));
      }
    });
  }
}