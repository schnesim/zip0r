export class FileModel {
    private _domNode: HTMLElement;
    private _timestamp: string;
    private _attribute: string;
    private _size: string;
    private _compressedSize: string;
    private _name: string;

    constructor(timestamp, attribute, size, compressedSize, name) {
        this._timestamp = timestamp;
        this._attribute = attribute;
        this._size = size;
        this._compressedSize = compressedSize;
        this._name = name;
        this._domNode = document.createElement('div');
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}