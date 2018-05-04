document.getElementById('image').ondragstart = function () {
    return false;
};

const fs = require('fs');
const request = require('request');
const $ = require('jquery');

const data = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));

let jsonData = null;
let username = document.querySelector('#username');
let platform = document.querySelector('#platform');
let remmeber = document.querySelector('#customControlInline');

const form = document.querySelector('form');
form.addEventListener('submit', search);

function searchStats() {

    if (data.remember) {
        data.username = username.value;
        data.platform = platform.value;
    }

    $("#body").load("stats.html");
}

if (data.remember) {
    remmeber.checked = true;
    username.value = data.username;
    platform.value = data.platform;
}

function onClick() {
    data.username = username.value;
    data.remember = remmeber.checked;
    data.platform = platform.value;
}

function search(e) {
    e.preventDefault();

    if (!username.value) return sendAlert('You need to provide a username!');

    let options = {
        method: 'GET',
        url: `http://localhost:8081/fortnite/v1/p=${platform.value.toLowerCase()}&u=${data.remember ? data.username : username.value}`,
        headers: {
            'User-Agent': 'nodejs request',
            'Stats-Api-Key': 'Y.aOity-Uguij2m.G*ij-goAm80m10oY',
            'Own-Api-Key': ''
        }
    };

    try {
        request(options, (err, resp, data) => {
            if (err) {
                console.log(err.toString());
                return false;
            }
            if (!data) return false;

            jsonData = JSON.parse(data);

            if (jsonData.error) {
                sendAlert(jsonData.error);
                return false;
            }

            searchStats();
        });

    } catch (e) {
        document.getElementById('sendAlert').innerHTML = `<div class="alert">` +
            `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>` +
            `Sorry, an error occurred while processing your request.</div>`;
    }
}

function sendAlert(alert) {
    const html = `<div class="alert"><span class="closebtn" onclick="this.parentElement.style.display='none';">` +
        `&times;</span>` + alert + `</div>`;

    document.getElementById('sendAlert').innerHTML = html;

    setTimeout(() => {
        document.getElementById('sendAlert').innerHTML = null;
    }, 5000);
}