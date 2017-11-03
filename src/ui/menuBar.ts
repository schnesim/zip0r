import { ViewElement } from './viewElement';
import { ZipController } from '../7z/zipController'
import { CallbackType, Callback } from './event';

export class MenuBar {
    private _domNode: HTMLDivElement;
    private _btnExtract: MenuButton;
    private _btnAdd: MenuButton;
    private _callbacks: Callback[];
    constructor() {
        this._domNode = document.createElement('div');
        this._domNode.classList.add('menu-bar');
        this._callbacks = [];
        this.createButtons();
    }

    private createButtons() {
        this._btnAdd = new MenuButton();
        // this._btnAdd.domNode.classList.add('menu-button-add')
        this._btnAdd.domNode.textContent = 'Add';
        this._btnAdd.registerCallback(this.addButtonCallback);
        this._domNode.appendChild(this._btnAdd.domNode);
        
        this._btnExtract = new MenuButton();
        // this._btnExtract.domNode.classList.add('menu-button-extract')
        this._btnExtract.domNode.textContent = 'Extract';
        this._btnExtract.registerCallback(this.extractButtonCallback.bind(this));
        this._domNode.appendChild(this._btnExtract.domNode);
        
    }

    public disableBtnExtract() {
        this._btnExtract.domNode.classList.remove('menu-button-active');
        this._btnExtract.domNode.classList.add('menu-button-disabled');
    }
    
    public enableBtnExtract() {
        this._btnExtract.domNode.classList.add('menu-button-active');
        this._btnExtract.domNode.classList.remove('menu-button-disabled');
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }

    public registerCallback(callback: Callback) {
        this._callbacks.push(callback);
    }

    private addButtonCallback() {
        console.log('addButtoncallback');
        // let z = new ZipController();
        // z.createZipFile('');
    }

    private extractButtonCallback() {
        this.fireCallback(CallbackType.EXTRACT);
    }

    private fireCallback(type: CallbackType) {
        this._callbacks.forEach(element => {
            if (element.type === type) {
                element.callback(this);
            }
        });
    }

}

export class MenuButton extends ViewElement {

    private _callbacks: Function[];

    constructor() {
        super();
        this._callbacks = [];
        this.domNode = document.createElement('div');
        this.domNode.classList.add('menu-button');
        this.domNode.classList.add('menu-button-active');
        this.domNode.addEventListener('click', this.clickEvent.bind(this));
    }

    private clickEvent(e: MouseEvent) {
        if (!this.isActive()) {
            return;
        }
        for (let callback of this._callbacks) {
            // We have to pass "this" so the object called back to knows, where the call is coming from
            // Alternatively we could define a function for each needed callback and not a generic one, which handles them all
            callback(this, e);
        }
    }

    public registerCallback(callback: Function) {
        this._callbacks.push(callback);
    }

    private isActive() {
        return this.domNode.classList.contains('menu-button-active');
    }

}