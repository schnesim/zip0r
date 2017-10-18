import { app, BrowserWindow, dialog, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
// const ipc = require('ipc');
// import * as ipc from 'ipc';
const client = process.env.NODE_ENV === 'development' ? require('electron-connect').client : void 0;
let mainWindow = void 0;

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 800, height: 600, minWidth: 800, webPreferences: {
      experimentalFeatures: true,
    },
    title: 'electron-typescript-boilerplate'
  });
  mainWindow.toggleDevTools();
  console.log(process.argv);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('archive-path', 'some path')
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  if (client !== void 0) {
    client.create(mainWindow);
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
});

const openFileCallback = (files) => {
  mainWindow.webContents.send('archive-path', files);
}

const template: Array<object> = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click() {
          require('electron').dialog.showOpenDialog(mainWindow, {
            title: 'Open archive',
            defaultPath: '.',
            filters: [
              { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile']
          }, openFileCallback);
        }
      },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { require('electron').shell.openExternal('https://electron.atom.io') }
      },
      {
        label: 'About',
        click() {
          dialog.showMessageBox(mainWindow, {
            title: 'About',
            message: 'Icons courtesy of:\r- www.iconfinder.com\r- icons8.com'
          })
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {

  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Edit menu
  template[1]['submenu'].push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  // Window menu
  template[3]['submenu'] = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

app.on('window-all-closed', function () {
  app.quit();
});