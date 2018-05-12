document.getElementById('image').ondragstart = () => {
    return false;
};

// Side menu

let isOpen = false;

function openNav() {
    if (!isOpen) {
        document.getElementById("mySidenav").style.width = "250px";
        isOpen = true
    } else {
        closeNav();
        isOpen = false
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    isOpen = false
}

function openSource() {
    require('electron').shell.openExternal("https://github.com/Jacxk/FortniteStatsTracker")
}

// logout
function returnLogin() {
    window.location = 'login.html';
}

// options
function options() {
    $("#body").load("settings.html");
}

function home() {
    $("#body").load("stats.html");
}

// Send Alert
const $ = require('jquery');

module.exports.sendAlert = (alert) => {
    const html = `<div class="alert"><span class="closebtn" onclick="this.parentElement.style.display='none';">` +
        `&times;</span>` + alert + `</div>`;

    $('#sendAlert').html(html);

    setTimeout(() => {
        $('#sendAlert').html(null);
    }, 5000);
};