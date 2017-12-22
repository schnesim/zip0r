import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { Container } from './ui/container';
import { remote } from 'electron'
const { Menu, MenuItem } = remote
let container;

document.addEventListener('DOMContentLoaded', function () {
  container = new Container();

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(container.getDomNode());
  // prevent content selection by double clicking
  body.addEventListener('mousedown', (e) => { e.preventDefault() });

  const menu = new Menu()
  menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }, false)

  if (process.env.NODE_ENV === 'development') {
    container.populateGrid(void 0, "zip0r.7z");
  }
});
