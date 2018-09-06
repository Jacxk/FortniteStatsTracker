const fetch = require('node-fetch');
const numberFormatter = require('number-formatter');

const statList = ["score", "kills", "deaths", "wins", "top5", "top25", "kd", "kpg", "scorePerMatch", "matches"];
const lifeStatList = ["score", "kills", "deaths", "wins", "top5", "top25", "kd", "matches"];

function getStatsFromServer() {
    return new Promise((resolve, reject) => {
        if (!checkIfLogged(true, true)) return;
        if (!Fortnite.username || !Fortnite.platform) reject("Username or platform cannot be blank");
        fetch(`https://fortnite-stats-tracker-api.herokuapp.com/v1/u=${Fortnite.username}&p=${Fortnite.platform}`)
            .then(res => res.json()).then(body => {
            if (!body.success) reject(body.data);
            const playerData = Fortnite.playerData;

            const lifeTime = this.lifeTime(body.data.stats);
            const solo = this.solo(body.data.stats);
            const duo = this.duo(body.data.stats);
            const squad = this.squad(body.data.stats);

            let stats = {
                id: body.data.id,
                username: Fortnite.username,
                platform: body.data.platform,
                lifeTime: lifeTime,
                solo: solo,
                duo: duo,
                squad: squad
            };
            playerData.setId(body.data.id);
            playerData.setLifeStats(lifeTime);
            playerData.setSoloStats(solo);
            playerData.setDuoStats(duo);
            playerData.setSquadStats(squad);
            resolve(stats);
        }).catch(err => {
            console.log(err);
            reject(err.toString());
        });
    });
}

async function displayStats() {
    if (!checkIfLogged(true, true)) return;

    const playerData = Fortnite.playerData;
    const lifeTime = playerData.getLifeStats();
    const solo = playerData.getSoloStats();
    const duo = playerData.getDuoStats();
    const squad = playerData.getSquadStats();

    await lifeStatList.forEach(value => {
        const $lifeTime = $('#lt_' + value);
        $lifeTime.html(lifeTime[value]);
    });

    await statList.forEach(value => {
        const $solo = $('#solo_' + value);
        const $duo = $('#duo_' + value);
        const $squad = $('#squad_' + value);

        $solo.html(solo[value]);
        $duo.html(duo[value]);
        $squad.html(squad[value]);

    });
}

function startStatsRefresh() {
    if (!checkIfLogged()) return;

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

    let time = 0;
    setInterval(() => {
        if (time <= 0) {
            time = 5 * 60000;
            getStatsFromServer(Fortnite.username, Fortnite.platform).then(() => displayStats());
        }

        time -= 1000;
        $('#countDown').html(millisToTimeString(time));
    }, 1000);
}

function lifeTime(stats) {
    return {
        score: numberFormatter("#,##0.##", stats.lifetime[6].Score),
        kills: numberFormatter("#,##0.##", stats.lifetime[10].Kills),
        deaths: numberFormatter("#,##0.##", Math.floor(parseInt(stats.lifetime[10].Kills) / parseFloat(stats.lifetime[11]["K/d"])).toString()),
        wins: numberFormatter("#,##0.##", stats.lifetime[8].Wins),
        top3: numberFormatter("#,##0.##", stats.lifetime[0]["Top 5s"]),
        top5: numberFormatter("#,##0.##", stats.lifetime[1]["Top 3s"]),
        top25: numberFormatter("#,##0.##", stats.lifetime[5]["Top 25s"]),
        kd: numberFormatter("#,##0.##", stats.lifetime[11]["K/d"]),
        matches: numberFormatter("#,##0.##", stats.lifetime[7]["Matches Played"])
    }
};

function solo(stats) {
    return {
        score: numberFormatter("#,##0.##", stats.solo.score),
        kills: numberFormatter("#,##0.##", stats.solo.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(stats.solo.kills / stats.solo.kd).toString()),
        wins: numberFormatter("#,##0.##", stats.solo.wins),
        top5: numberFormatter("#,##0.##", stats.solo.top_5),
        top25: numberFormatter("#,##0.##", stats.solo.top_25),
        kd: numberFormatter("#,##0.##", stats.solo.kd),
        kpg: numberFormatter("#,##0.##", stats.solo.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", stats.solo.score_per_match),
        matches: numberFormatter("#,##0.##", stats.solo.matches)
    }
};

function duo(stats) {
    return {
        score: numberFormatter("#,##0.##", stats.duo.score),
        kills: numberFormatter("#,##0.##", stats.duo.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(stats.duo.kills / stats.duo.kd).toString()),
        wins: numberFormatter("#,##0.##", stats.duo.wins),
        top5: numberFormatter("#,##0.##", stats.duo.top_5),
        top25: numberFormatter("#,##0.##", stats.duo.top_25),
        kd: numberFormatter("#,##0.##", stats.duo.kd),
        kpg: numberFormatter("#,##0.##", stats.duo.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", stats.duo.score_per_match),
        matches: numberFormatter("#,##0.##", stats.duo.matches)
    }
};

function squad(stats) {
    return {
        score: numberFormatter("#,##0.##", stats.squad.score),
        kills: numberFormatter("#,##0.##", stats.squad.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(stats.squad.kills / stats.squad.kd).toString()),
        wins: numberFormatter("#,##0.##", stats.squad.wins),
        top5: numberFormatter("#,##0.##", stats.squad.top_5),
        top25: numberFormatter("#,##0.##", stats.squad.top_25),
        kd: numberFormatter("#,##0.##", stats.squad.kd),
        kpg: numberFormatter("#,##0.##", stats.squad.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", stats.squad.score_per_match),
        matches: numberFormatter("#,##0.##", stats.squad.matches)
    }
};
