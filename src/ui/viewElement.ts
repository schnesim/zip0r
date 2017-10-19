export abstract class ViewElement {

    private _domNode: HTMLElement;

    set domNode(elem: HTMLElement) {;
        this._domNode = elem;
    }

    get domNode(): HTMLElement {
        return this._domNode;
    }
}