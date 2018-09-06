const electron = require('electron');
const {ipcMain} = electron;

module.exports.enableListeners = function enableListeners(richPresence) {
    ipcMain.on('rpc:events', (event, data) => {
        richPresence.setUsername(data.username);
        richPresence.setPlatform(data.platform);
        switch (data.state) {
            case "news":
                richPresence.setWatchingNews();
                break;
            case "challenges":
                richPresence.setWatchingChallenges();
                break;
            case "items_store":
                richPresence.setWatchingStore();
                break;
            case "patch_notes":
                richPresence.setWatchingChangelog();
                break;
            case "upcoming_items":
                richPresence.setWatchingNewItems();
                break;
            case "logout":
                richPresence.setLoggedOff();
                break;
            case "stats":
                richPresence.setWatchingStats();
                break;
        }
    });
};