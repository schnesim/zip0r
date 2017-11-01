import { ViewElement } from './viewElement';
import { ZipController } from '../7z/zipController'

export class MenuBar {
    private _domNode: HTMLDivElement;
    private _btnExtract: MenuButton;
    private _buttons: Array<MenuButton>;
    private _callbacks: Function[];
    constructor() {
        this._domNode = document.createElement('div');
        this._buttons = [];
        this._callbacks = [];
        this.createButtons();
        this._buttons.forEach(element => {
            this._domNode.appendChild(element.domNode);
        });
    }

    private createButtons() {
        let menuButton = new MenuButton();
        menuButton.domNode.classList.add('menu-button-add')
        menuButton.domNode.textContent = 'Add';
        this._buttons.push(menuButton);
        menuButton.domNode.addEventListener('click', () => {
            let z = new ZipController();
            z.createZipFile('');
        })
        menuButton = new MenuButton();
        menuButton.domNode.classList.add('menu-button-extract')
        menuButton.domNode.textContent = 'Extract';
        menuButton.registerCallback(this.extractButtonCallback);
        this._buttons.push(menuButton);
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }

    public registerCallback(callback: Function) {
        this._callbacks.push(callback);
    }

    private extractButtonCallback() {
        console.log('extractbuttoncallback');
    }

}

export class MenuButton extends ViewElement {

    private _callbacks: Function[];
    
    constructor() {
        super();
        this._callbacks = [];
        this.domNode = document.createElement('div');
        this.domNode.classList.add('menu-button');
        this.domNode.addEventListener('click', this.clickEvent.bind(this));
    }

    private clickEvent(e: MouseEvent) {
        console.log(e);
        for (let callback of this._callbacks) {
            // We have to pass "this" so the object called back to knows, where the call is coming from
            // Alternatively we could define a function for each needed callback and not a generic one, which handles them all
            callback(this, e);
        }
    }

    public registerCallback(callback: Function) {
        this._callbacks.push(callback);
    }

}