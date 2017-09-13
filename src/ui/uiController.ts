export class UiController {
    private _domNode: HTMLDivElement;
    constructor() {
        this._domNode = document.createElement('div');
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}