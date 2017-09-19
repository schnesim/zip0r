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
        this._buttons.push(new MenuButton('Extract'));
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}

export class MenuButton extends ViewElement {;
    /**
     * Fräge: Wie komme ich von einem Click event auf einen MenuButton zu einer Methode im UiController?
     * Problemstellung: Eine Komponente möchte eine Aktion irgendwo anders auslösen. D.h. die Komponente
     * muss in der Lage sein, Events zu erzeugen, mit Informationen anzureichern, zu verschicken und die
     * Komponenten auf der anderen Seite, die ihrerseits die Aktion auszuführen haben, hören auf derartige
     * Events. notify()
     */
    
    constructor(name) {
        super();
        this.setDomNode(document.createElement('button'));
        this.getDomNode().classList.add('menu-button');
        (this.getDomNode() as HTMLButtonElement).innerText = name;
    }
    
}