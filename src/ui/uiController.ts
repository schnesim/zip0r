import { MenuBar } from './menuBar'
export class UiController {
    private _domNode: HTMLElement;
    constructor() {
        this._domNode = document.createElement('div');
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}

export class Container {
    private _domNode: HTMLElement;
    private _menuBar: MenuBar;
    constructor() {
        this._domNode = document.createElement('div');
        this._domNode.className = 'container'
        this._menuBar = new MenuBar();
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}