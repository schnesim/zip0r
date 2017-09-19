export abstract class ViewElement {

    private _domNode: HTMLElement;

    public setDomNode(elem: HTMLElement): void {
        this._domNode = elem;
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}