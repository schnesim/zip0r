import { MenuButton } from "./menuButton";
import { MenuBar } from "./menuBar";


export class MenuButtonBuilder {
  private _menuButton: MenuButton;
  constructor() {
    this._menuButton = new MenuButton;
  }

  public title(title: string): MenuButtonBuilder {
    this._menuButton.domNode.textContent = title;
    return this;
  }

  public callback(callback: Function): MenuButtonBuilder {
    this._menuButton.registerCallback(callback);
    return this;
  }

  public build(): MenuButton {
    return this._menuButton;
  }
}