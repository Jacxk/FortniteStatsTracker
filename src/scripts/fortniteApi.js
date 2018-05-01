const statList = ["score", "kills", "deaths", "top1", "top10", "top25", "kd", "kpg", "scorePerMatch", "matches"];
let time = 5 * 60000;

function returnLogin() {
    window.location = 'login.html';
}

function getStats() {

    const lifeTime = jsonData.lifeTimeStats;
    const solo = jsonData.stats.p2;
    const duo = jsonData.stats.p10;
    const squad = jsonData.stats.p9;

    getLifeStats(lifeTime);
    statList.forEach(value => {
        if (value === 'deaths') {
            const solokills = parseInt(solo['kills'].value);
            const solokd = parseFloat(solo['kd'].value);

            const duokills = parseInt(duo['kills'].value);
            const duokd = parseFloat(duo['kd'].value);

            const squadkills = parseInt(squad['kills'].value);
            const squadkd = parseFloat(squad['kd'].value);

            document.getElementById('solo' + value).innerHTML = Math.floor(solokills / solokd).toString();
            document.getElementById('duo' + value).innerHTML = Math.floor(duokills / duokd).toString();
            document.getElementById('squad' + value).innerHTML = Math.floor(squadkills / squadkd).toString();

            return;
        }
        document.getElementById('solo' + value).innerHTML = solo[value].displayValue;
        document.getElementById('duo' + value).innerHTML = duo[value].displayValue;
        document.getElementById('squad' + value).innerHTML = squad[value].displayValue;
    });

    document.getElementById('account').innerHTML = username.value;
}

function getLifeStats(lifeTime) {
    const stats = [6, 10, 0, 8, 1, 5, 11, 7];

    stats.forEach(value => {
        if (value === 0) {
            const kills = parseInt(lifeTime[10].value);
            const kd = parseFloat(lifeTime[11].value);

            document.getElementById('lifedeaths').innerHTML = Math.floor(kills / kd).toString();
            return;
        }
        document.getElementById('life' + value).innerHTML = lifeTime[value].value;
    });
}

function getTimeLeft() {
    if (time <= 0) {
        time = 5 * 60000;
        getStats();
    }

    time -= 1000;
    document.getElementById('countDown').innerHTML = millisToTimeString(time);
}

function millisToTimeString(ms) {
    let days, hours, minutes, seconds;
    seconds = Math.floor(ms / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;

    return ((days === 0 ? '' : days + " days ") + (hours === 0 ? '' : hours + " hours ")
        + (minutes === 0 ? '' : minutes + " minutes ") + seconds + " seconds");
}

getStats();
setInterval(() => getTimeLeft(), 1000);

fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) console.log(err.stack)
});