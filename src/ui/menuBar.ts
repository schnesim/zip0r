import { ViewElement } from './viewElement';
import { ZipController } from '../7z/zipController'

export class MenuBar {
    private _domNode: HTMLDivElement;
    private _btnExtract: MenuButton;
    private _buttons: Array<MenuButton>;
    constructor() {
        this._domNode = document.createElement('div');
        this._buttons = [];
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
        this._buttons.push(menuButton);
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}

export class MenuButton extends ViewElement {
    ;
    constructor() {
        super();
        this.domNode = document.createElement('div');
        this.domNode.classList.add('menu-button');
        this.domNode.addEventListener('mouseenter', this.mouseover.bind(this));
        this.domNode.addEventListener('mouseleave', this.mouseleave.bind(this));
        this.domNode.addEventListener('mousedown', this.mousedown.bind(this));
        this.domNode.addEventListener('mouseup', this.mouseup.bind(this));
    }

    private mouseover() {
        this.domNode.style.backgroundColor = 'rgb(213,202,0)';
    }

    private mouseleave() {
        this.domNode.style.backgroundColor = 'lightyellow';
    }

    private mousedown(e: MouseEvent) {
        if (e.button === 0) {
            this.domNode.style.backgroundColor = 'rgb(98,92,0)';
        }
    }

    private mouseup() {
        this.domNode.style.backgroundColor = 'rgb(213,202,0)';
    }
}