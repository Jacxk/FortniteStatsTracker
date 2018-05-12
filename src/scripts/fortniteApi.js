const statList = ["score", "kills", "deaths", "top1", "top5", "top25", "kd", "kpg", "scorePerMatch", "matches"];
const lifeStatList = ["score", "kills", "deaths", "top1", "top5", "top25", "kd", "matches"];

let time = 5 * 60000;

function getStats() {

    const lifeTime = jsonData.lifeTime;
    const solo = jsonData.solo;
    const duo = jsonData.duo;
    const squad = jsonData.squad;

    lifeStatList.forEach(value => {
        if (value === 'deaths') {
            const lifekills = parseInt(lifeTime['kills']);
            const lifekd = parseFloat(lifeTime['kd']);

            document.getElementById('life' + value).innerHTML = Math.floor(lifekills / lifekd).toString();
        }

        document.getElementById('life' + value).innerHTML = lifeTime[value];
    });

    statList.forEach(value => {
        if (value === 'deaths') {

            const solokills = parseInt(solo['kills']);
            const solokd = parseFloat(solo['kd']);

            const duokills = parseInt(duo['kills']);
            const duokd = parseFloat(duo['kd']);

            const squadkills = parseInt(squad['kills']);
            const squadkd = parseFloat(squad['kd']);

            document.getElementById('solo' + value).innerHTML = Math.floor(solokills / solokd).toString();
            document.getElementById('duo' + value).innerHTML = Math.floor(duokills / duokd).toString();
            document.getElementById('squad' + value).innerHTML = Math.floor(squadkills / squadkd).toString();

            return;
        }
        document.getElementById('solo' + value).innerHTML = solo[value];
        document.getElementById('duo' + value).innerHTML = duo[value];
        document.getElementById('squad' + value).innerHTML = squad[value];
    });

    document.getElementById('account').innerHTML = username.value;
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