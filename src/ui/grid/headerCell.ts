import { Callback } from '../../domain/callback';
import { CallbackType } from '../../domain/callbackType';
import { MousePosition } from '../../domain/mousePosition';
import { IEvent } from '../event';
import { ViewElement } from '../viewElement';
import { GridColumnConfig } from './gridColumn';
import { HeaderCellClickEvent } from './headerCellClickEvent';
import { HeaderCellResizeEvent } from './headerCellResizeEvent';
import { ResizeEvent } from './resizeStartEvent';

export class HeaderCell extends ViewElement {

  private _sortIcon: HTMLImageElement;
  private _colNumber: Number;
  private _clickCallback: Function;
  private _mouseoverCallback: Function;
  private _isFirst: boolean;
  private _isLast: boolean;
  // private _mouseEnter: boolean;
  private _resizing: boolean;
  private _mouseDown: boolean;
  private _mouseDownInitalPos: MousePosition;
  private _mouseDownNewPos: MousePosition;
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
    header.addEventListener('mouseleave', this.headerCellMouseLeave.bind(this));
    header.addEventListener('mousemove', this.headerCellMouseMove.bind(this));
    header.addEventListener('mousedown', this.headerCellMouseDown.bind(this));
    header.addEventListener('mouseup', this.headerCellMouseUp.bind(this));
    this.domNode = header;
  }

  public registerCallback(callback: Callback) {
    this._callbacks.push(callback);
  }

  public resetSortIcon() {
    this._sortIcon.style.visibility = 'hidden';
  }

  private fireCallback(event: IEvent) {
    this._callbacks.forEach(callback => {
      if (callback.type === event.callbackType) {
        callback.callback(event);
      }
    });
  }

  private headerCellMouseDown(e: MouseEvent) {
    this._mouseDown = true;
    if (this.withinResizeArea(e)) {
      this._resizing = true;
    }
    this._mouseDownInitalPos = new MousePosition(e.clientX, e.clientY);
  }

  private headerCellMouseUp(e: MouseEvent) {
    this._mouseDown = false;
    if (this._resizing) {

    }
  }

  private headerCellMouseEnter(e: MouseEvent) {
    // this._mouseEnter = true;
  }

  private headerCellMouseLeave(e: MouseEvent) {
    if (!this._resizing) {
      this.fireCallback(new ResizeEvent(CallbackType.HORIZONTAL_RESIZE_STOP));
    }
  }

  private headerCellMouseMove(e: MouseEvent) {
    this._mouseDownNewPos = new MousePosition(e.clientX, e.clientY);
    if (this.withinResizeArea(e)) {
      this.fireCallback(new ResizeEvent(CallbackType.HORIZONTAL_RESIZE_START));
    } else if (!this._resizing) {
      this.fireCallback(new ResizeEvent(CallbackType.HORIZONTAL_RESIZE_STOP));
    }
    if (this._resizing) {
      this.headerCellResize(e);
    }
  }

  private headerCellResize(e: MouseEvent) {
    const fieldname = e.srcElement.getAttribute('fieldname');
    const colNumber = parseInt(e.srcElement.getAttribute('colNumber'));
    this.fireCallback(new HeaderCellResizeEvent(fieldname, colNumber, this._mouseDownInitalPos, this._mouseDownNewPos));
  }

  private withinResizeArea(e: MouseEvent): boolean {
    const cellBoundingRect = this.domNode.getBoundingClientRect();
    if (this.withinLeftMargin(e, cellBoundingRect) || this.withinRightMargin(e, cellBoundingRect)) {
      return true;
    }
    return false;
  }

  private withinLeftMargin(e: MouseEvent, cellBoundingRect: ClientRect) {
    const leftBoundary = cellBoundingRect.left;
    const rightBoundary = cellBoundingRect.left + 5;
    return e.pageX >= leftBoundary && e.pageX <= rightBoundary && !this._isFirst;
  }

  private withinRightMargin(e: MouseEvent, cellBoundingRect: ClientRect) {
    const leftBoundary = cellBoundingRect.right - 5;
    const rightBoundary = cellBoundingRect.right;
    return e.pageX >= leftBoundary && e.pageX <= rightBoundary && !this._isLast;
  }

  private headerCellClick(e: MouseEvent) {
    this._sortIcon.style.visibility = 'visisble';
    if (this._reverseOrder) {
      this._sortIcon.src = './ui/grid/arrow-down.svg';
    } else {
      this._sortIcon.src = './ui/grid/arrow-up.svg';
    }
    this._reverseOrder = !this._reverseOrder;
    const fieldname = e.srcElement.getAttribute('fieldname');
    this.fireCallback(new HeaderCellClickEvent(fieldname, this._reverseOrder));
  }
}