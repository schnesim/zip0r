import { Callback } from '../../domain/callback';
import { CallbackType } from '../../domain/callbackType';
import { MousePosition } from '../../domain/mousePosition';
import { IEvent } from '../event';
import { ViewElement } from '../viewElement';
import { GridColumnConfig } from './gridColumn';
import { HeaderCellClickEvent } from './headerCellClickEvent';
import { HeaderCellResizeEvent } from './headerCellResizeEvent';
import { ResizeStartEvent } from './resizeStartEvent';
import { IEventListener } from '../../event/listener';
import { EventType } from '../../domain/eventType';
import { IPublishEvent } from '../../event/event';

export class HeaderCell extends ViewElement implements IEventListener {
  notify(event: IPublishEvent) {
    switch (event.eventType) {
      case EventType.MOUSE_MOVE: {
        this.publish(event);
      }
    }
  }

  private _sortIcon: HTMLImageElement;
  private _colNumber: Number;
  private _clickCallback: Function;
  private _mouseoverCallback: Function;
  private _isFirst: boolean;
  private _isLast: boolean;
  private _sortable: boolean;
  // private _mouseEnter: boolean;
  private _resizing: boolean;
  private _mouseDown: boolean;
  private _mouseDownInitalPos: MousePosition;
  private _mouseDownNewPos: MousePosition;
  private _gridColum: GridColumnConfig;
  private _callbacks: Callback[];
  private _reverseOrder: boolean = false;

  eventTypes: EventType[];

  constructor(column: GridColumnConfig, colNumber: number) {
    super();
    this._isFirst = column.isFirst;
    this._isLast = column.isLast;
    this._callbacks = [];
    this.eventTypes = [];
    this.eventTypes.push(EventType.MOUSE_MOVE);
    this.createHeaderCell(column, colNumber);
  }

  private createHeaderCell(column: GridColumnConfig, colNumber: number) {
    const header = document.createElement('th');
    header.className = 'header-cell';
    header.textContent = column.title;
    header.style.width = column.width;
    this._sortable = column.sortable;
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
    if (this._sortIcon) {
      this._sortIcon.style.visibility = 'hidden';
    }
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
      this.fireCallback(
        new ResizeStartEvent(
          CallbackType.HORIZONTAL_RESIZE_START,
          e.srcElement.getAttribute('fieldname'),
          this._mouseDownInitalPos)
      );
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
      // const fieldname = e.srcElement.getAttribute('fieldname');
      // this.fireCallback(new ResizeStartEvent(CallbackType.HORIZONTAL_RESIZE_STOP, fieldname, this._mouseDownInitalPos));
    }
  }

  private headerCellMouseMove(e: MouseEvent) {
    // this._mouseDownNewPos = new MousePosition(e.clientX, e.clientY);
    // if (this.withinResizeArea(e) && this._mouseDown) {
    // } else if (this.withinResizeArea(e) && !this._mouseDown) {
    //   this.domNode.style.cursor = 'ew-resize';
    // } else if (!this.withinResizeArea(e) && !this._resizing) {
    //   // Problem: If I'm resizing column one and move the cursor accross the middle of column 2 then the cursor style will
    //   // turn to default style, since the 2nd column doesn't know that resizing is going on.
    //   // So the container class has to be solely responsible for any cursor change.
    //   this.domNode.style.cursor = 'default';
    // }
    // else if (!this._resizing) {
    //   this.fireCallback(new ResizeStartEvent(CallbackType.HORIZONTAL_RESIZE_STOP, fieldname, this._mouseDownInitalPos));
    // }
    // if (this._resizing) {
    //   this.headerCellResize(e);
    // }
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