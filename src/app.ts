import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { UiController, Container } from './ui/uiController';
import { ZipController } from './7z/zipController';

const { remote } = require('electron')
const { Menu, MenuItem } = remote

document.addEventListener('DOMContentLoaded', function () {
  let uiController = new UiController();
  

  const z = new ZipController();
  z.listArchiveContent('zip0r.7z');

  const menu = new Menu()
  menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }, false)
});
