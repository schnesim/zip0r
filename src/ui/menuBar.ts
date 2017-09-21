import { ViewElement } from './viewElement';

export class MenuBar {
    private _domNode: HTMLDivElement;
    private _btnExtract: MenuButton;
    private _buttons: Array<MenuButton>;
    constructor() {
        this._domNode = document.createElement('div');
        this._buttons = [];
        this.createButtons();
        this._buttons.forEach(element => {
            this._domNode.appendChild(element.getDomNode());
        });
    }

    private createButtons() {
        let menuButton = new MenuButton();
        menuButton.getDomNode().classList.add('menu-button-add')
        this._buttons.push(menuButton);
        menuButton = new MenuButton();
        menuButton.getDomNode().classList.add('menu-button-extract')
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
        this.setDomNode(document.createElement('button'));
        this.getDomNode().classList.add('menu-button');
        this.getDomNode().addEventListener('mouseenter', this.mouseover.bind(this));
        this.getDomNode().addEventListener('mouseleave', this.mouseleave.bind(this));
        this.getDomNode().addEventListener('mousedown', this.mousedown.bind(this));
        this.getDomNode().addEventListener('mouseup', this.mouseup.bind(this));
    }

    private mouseover() {
        this.getDomNode().style.backgroundColor = 'rgb(213,202,0)';
    }

    private mouseleave() {
        this.getDomNode().style.backgroundColor = 'lightyellow';
    }

    private mousedown(e: MouseEvent) {
        if (e.button === 0) {
            this.getDomNode().style.backgroundColor = 'rgb(98,92,0)';
        }
    }

    private mouseup() {
        this.getDomNode().style.backgroundColor = 'rgb(213,202,0)';
    }
}