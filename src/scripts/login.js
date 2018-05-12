const fs = require('fs');
const $ = require('jquery');
const stats = require('../scripts/stats.js');
const util = require('../scripts/utility.js');

const data = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));

let username = document.getElementById('username');
let platform = document.getElementById('platform');
let remember = document.getElementById('rememberInput');

const form = document.querySelector('form');
form.addEventListener('submit', search);

let jsonData = null;

function searchStats() {

    if (data.login.remember) {
        data.login.username = username.value;
        data.login.platform = platform.value;
    }

    $("#body").load("stats.html");
}

username.value = data.login.username;
platform.value = data.login.platform;

if (data.login.remember) {
    remember.checked = true;
    if (!data.started) {
        data.started = true;
        search()
    }
}

function onClick() {
    data.login.username = username.value;
    data.login.remember = remember.checked;
    data.login.platform = platform.value;

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) console.log(err.stack)
    });
}

function search(e) {
    if (e) e.preventDefault();
    stats.sendStatsFromServer(username.value, platform.value, data.login).then(data => {
        jsonData = data;
        searchStats();
    }).catch(err => util.sendAlert(err.toString()));
}
