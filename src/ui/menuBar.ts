export class MenuBar {
    private _domNode: HTMLDivElement;
    private _btnExtract: MenuButton;
    constructor() {
        this._domNode = document.createElement('div');
    }
}

export class MenuButton {
    /**
     * Fräge: Wie komme ich von einem Click event auf einen MenuButton zu einer Methode im UiController?
     * Problemstellung: Eine Komponente möchte eine Aktion irgendwo anders auslösen. D.h. die Komponente
     * muss in der Lage sein, Events zu erzeugen, mit Informationen anzureichern, zu verschicken und die
     * Komponenten auf der anderen Seite, die ihrerseits die Aktion auszuführen haben hören auf derartige
     * Events. notify()
     */
    private _domNode: HTMLElement;
    constructor() {
        this._domNode = document.createElement('div');
    }

    public getDomNode(): HTMLElement {
        return this._domNode;
    }
}