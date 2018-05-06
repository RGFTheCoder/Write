'use strict'

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
            // frame: false,
            // transparent: true
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

});

var ipc = require('electron').ipcMain;

ipc.on('close-main-window', function() {
    app.quit();
});
ipc.on('max-main-window', function() {
    mainWindow.maximize();
});
ipc.on('min-main-window', function() {
    mainWindow.minimize();
});