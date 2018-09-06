const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const DiscordRPC = require('discord-rpc');
const {app, BrowserWindow, Menu} = electron;

let mainWindow = null;
let splashScreen = null;
let mainLoaded = false;

require('update-electron-app')({
    repo: 'Jacxk/FortniteStatsTracker',
    updateInterval: '1 hour'
});

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
        icon: './assets/icons/png/transparent-icon.png',
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
        icon: './assets/icons/png/transparent-icon.png',
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
            "started": true,
            "login": {
                "username": null,
                "remember": false,
                "platform": "pc"
            }
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

app.on('before-quit', () => {

    const data = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));

    data.started = false;

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) console.log(err.stack)
    });
});
const clientID = '445298809388400640';
DiscordRPC.register(clientID);

const rpc = new DiscordRPC.Client({transport: 'ipc'});
const startTimestamp = new Date();

async function setActivity() {
    if (!rpc || !mainWindow)
        return;

    const data = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));
    const username = data.login.username;

    rpc.setActivity({
        details: `${!username ? 'Thinking about who to search' : `Watching ${username}${username.charAt(username.length - 1) === 's' ? "'" : "'s"} Stats`}`,
        startTimestamp,
        largeImageKey: 'logo_big',
        largeImageText: 'Searching for: ' + username,
        smallImageKey: 'logo_small',
        smallImageText: 'Made by: Jacxk',
        instance: false,
    });
}

rpc.on('ready', () => {
    setActivity().catch(err => console.log(err));
    setInterval(() => {
        setActivity().catch(err => console.log(err));
    }, 15e3);
});

rpc.login(clientID).catch(console.error);