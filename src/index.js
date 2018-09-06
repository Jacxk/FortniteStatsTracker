const electron = require('electron');
const url = require('url');
const path = require('path');
const ipcListeners = require('./ipcListeners');
const {app, BrowserWindow} = electron;

const RichPresence = require("./libraries/classes/RichPresence");
const presence = new RichPresence();

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {devTools: true},
        show: false,
        center: true,
        icon: "./assets/icons/png/transparent-icon.png"
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'viewer/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        presence.login();
        ipcListeners.enableListeners(presence);
    });
});

app.on('window-all-closed', () => {
    app.quit();
    presence.rpc.disconnect();
});