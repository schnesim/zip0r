import { app, BrowserWindow } from 'electron';
import * as path from 'path';
const client = process.env.NODE_ENV === 'development' ? require('electron-connect').client : void 0;

app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: 800, height: 600, minWidth: 800, webPreferences: {
      experimentalFeatures: true,
    },
    title: 'electron-typescript-boilerplate'
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  if (client !== void 0) {
    client.create(mainWindow);
  }
});

app.on('window-all-closed', function () {
  app.quit();
});