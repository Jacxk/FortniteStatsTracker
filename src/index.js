const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow, Menu} = electron;

let mainWindow = null;
let splashScreen = null;
let mainLoaded = false;

app.on('ready', () => {
    createMissingFiles().then(() => {
        loadSplashWindow();
        loadMainWindow();
        loadTopMenu();
    }).catch(err => console.log(err.message));
});

function loadSplashWindow() {
    splashScreen = new BrowserWindow({
        width: 700,
        height: 531,
        title: 'Loading...',
        resizable: false,
        center: true,
        show: true,
        transparent: true,
        frame: false,
        autoHideMenuBar: true,
        icon: './assets/icons/win/icon.ico',
        titleBarStyle: 'hidden',
        movable: true
    });

    splashScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/loadScreen.html'),
        protocol: 'file:',
        slashes: true
    }));

    splashScreen.on('closed', () => {
        if (!mainLoaded) app.quit();
    });
}

function loadMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: './assets/icons/win/icon.ico',
        webPreferences: {devTools: true},
        show: false
    });

    mainWindow.setMenu(null);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/login.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainLoaded = true;

        splashScreen.close();
        splashScreen = null;
    });
}

function loadTopMenu() {
    const config = JSON.parse(fs.readFileSync('./src/config.json'));

    if (!config.enableTopMenu) return;

    const topMenu = [{
        label: 'Options',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'DevTools',
                accelerator: 'CmdOrCtrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(topMenu))
}

async function createMissingFiles() {
    if (!fs.existsSync('./src/data.json')) {
        console.log('Data file does not exist, creating it...');
        await fs.writeFile('./src/data.json', JSON.stringify({
            "username": null,
            "remember": false,
            "platform": "pc"
        }, null, 2), (err) => {
            if (err) console.log('Data file error:' + err.stack)
        });
    }
    if (!fs.existsSync('./src/config.json')) {
        console.log('Config file does not exist, creating it...');
        await fs.writeFile('./src/config.json', JSON.stringify({
            "enableTopMenu": false
        }, null, 2), (err) => {
            if (err) console.log('Config file error:' + err.stack)
        });
    }
}