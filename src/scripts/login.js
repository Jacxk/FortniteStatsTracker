const fs = require('fs');
const $ = require('jquery');
const stats = require('../scripts/stats.js');
const util = require('../scripts/utility.js');

const data = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));

let username = $('#username');
let platform = $('#platform');
let remember = $('#rememberInput');

const form = document.querySelector('form');
form.addEventListener('submit', search);

let jsonData = null;

function searchStats() {

    if (data.remember) {
        data.username = username.value;
        data.platform = platform.value;
    }

    $("#body").load("stats.html");
}

if (data.remember) {
    remember.checked = true;
    username.value = data.username;
    platform.value = data.platform;
}

function onClick() {
    data.username = username.value;
    data.remember = remember.checked;
    data.platform = platform.value;
}

function search(e) {
    e.preventDefault();
    stats.sendStatsFromServer(username.value, platform.value, data).then(data => {
        jsonData = data;
        searchStats();
    }).catch(err => util.sendAlert(err.toString()));

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) console.log(err.stack)
    });
}
