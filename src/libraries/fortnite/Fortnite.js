const PlayerData = require('../libraries/classes/PlayerData.js');

let Fortnite = {logged: false, first_time: true};

function login(username, platform) {
    username = username.toLowerCase();
    platform = platform.toLowerCase();

    Fortnite.playerData = new PlayerData(username, platform);
    Fortnite.username = username;
    Fortnite.platform = platform;
    Fortnite.logged = true;

    storage.setUsername(username).setPlatform(platform).save();

}

function checkIfLogged(alert = true) {
    if (!Fortnite.logged) {
        if (alert) M.toast({html: "You're not logged in... Login first!", displayLength: 4000, classes: "red lighten-1"});
        loading.hide();
        return false;
    }
    return true;
}

function toggleWindows(window) {
    $("[toggleable]").hide();
    window.show();
}
