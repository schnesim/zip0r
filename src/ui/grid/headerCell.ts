import { HeaderCellResizeEvent } from './headerCellResizeEvent';
import { Callback } from '../../domain/callback';
import { CallbackType } from '../../domain/callbackType';
import { IEventListener } from '../../event/event';
import { IEvent } from '../event';
import { ViewElement } from '../viewElement';
import { GridColumnConfig } from './gridColumn';
import { HeaderCellClickEvent } from './headerCellClickEvent';

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

  fireCallback(event: IEvent) {
    if (event.callbackType === CallbackType.HEADER_CLICK) {
      this._callbacks.forEach(callback => {
        if (callback.type === CallbackType.HEADER_CLICK) {
          callback.callback(event);
        }
      });
    } else if (event.callbackType === CallbackType.HEADER_RESIZE) {
      this._callbacks.forEach(callback => {
        if (callback.type === CallbackType.HEADER_RESIZE) {
          callback.callback(event);
        }
      });
    }
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
    if (!this._mouseEnter && !this._mouseDown) {
      return;
    }
    this.updateCursor(e);
    if (this._mouseDown) {
      this.headerCellResize(e);
    }
  }

  private headerCellResize(e: MouseEvent) {
    const fieldname = e.srcElement.getAttribute('fieldname');
    this.fireCallback(new HeaderCellResizeEvent(fieldname));
  }

  private updateCursor(e: MouseEvent) {
    const cellBoundingRect = this.domNode.getBoundingClientRect();
    if (this.withinLeftMargin(e, cellBoundingRect) || this.withinRightMargin(e, cellBoundingRect)) {
      this.domNode.style.cursor = 'ew-resize';
    }
    else {
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
      this._sortIcon.src = './ui/grid/arrow-down.svg';
    } else {
      this._sortIcon.src = './ui/grid/arrow-up.svg';
    }
    this._reverseOrder = !this._reverseOrder;
    const fieldname = e.srcElement.getAttribute('fieldname');
    this.fireCallback(new HeaderCellClickEvent(fieldname, this._reverseOrder));
  }
}