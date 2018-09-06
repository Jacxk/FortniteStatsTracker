const request = require('request');
const numberFormatter = require('number-formatter');

let jsonData = null;

module.exports.sendStatsFromServer = (username, platform, data) => {
    return new Promise((resolve, reject) => {
        if (!username) return reject('You need to provide a username!');
        if (!platform) platform = 'pc';

        let options = {
            method: 'GET',
            url: `https://fortnite-stats-tracker-api.herokuapp.com/v1/u=${data.remember ? data.username : username.toLowerCase()}&p=${platform.toLowerCase()}`,
            headers: {
                'User-Agent': 'nodejs request'
            }
        };

        try {
            request(options, (err, resp, data) => {
                if (err) {
                    console.log(err);
                    reject(err.toString());
                    return false;
                }
                if (!data) return reject("No data found");

                jsonData = JSON.parse(data);

                if (jsonData.success === false) {
                    reject(jsonData.data);
                    return false;
                }

                const fixedData = {
                    username: username,
                    platform: platform,
                    lifeTime: lifeTime(jsonData),
                    solo: solo(jsonData),
                    duo: duo(jsonData),
                    squad: squad(jsonData)
                };

                module.exports.jsonData = fixedData;

                resolve(fixedData);
            });

        } catch (e) {
            console.log(e.stack);
            reject('Sorry, an error occurred while processing your request.');
        }
    });
};

const lifeTime = module.exports.lifeTime = (jsonData) => {
    return {
        score: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[6].Score),
        kills: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[10].Kills),
        deaths: numberFormatter("#,##0.##", Math.floor(parseInt(jsonData.data.stats.lifetime[10].Kills) / parseFloat(jsonData.data.stats.lifetime[11]["K/d"])).toString()),
        top1: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[8].Wins),
        top3: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[0]["Top 3"]),
        top5: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[1]["Top 5s"]),
        top25: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[5]["Top 25s"]),
        kd: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[11]["K/d"]),
        matches: numberFormatter("#,##0.##", jsonData.data.stats.lifetime[7]["Matches Played"])
    }
};

const solo = module.exports.solo = (jsonData) => {
    return {
        score: numberFormatter("#,##0.##", jsonData.data.stats.solo.score),
        kills: numberFormatter("#,##0.##", jsonData.data.stats.solo.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(jsonData.data.stats.solo.kills / jsonData.data.stats.solo.kd).toString()),
        top1: numberFormatter("#,##0.##", jsonData.data.stats.solo.wins),
        top5: numberFormatter("#,##0.##", jsonData.data.stats.solo.top_5),
        top25: numberFormatter("#,##0.##", jsonData.data.stats.solo.top_25),
        kd: numberFormatter("#,##0.##", jsonData.data.stats.solo.kd),
        kpg: numberFormatter("#,##0.##", jsonData.data.stats.solo.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", jsonData.data.stats.solo.score_per_match),
        matches: numberFormatter("#,##0.##", jsonData.data.stats.solo.matches)
    }
};

const duo = module.exports.duo = (jsonData) => {
    return {
        score: numberFormatter("#,##0.##", jsonData.data.stats.duo.score),
        kills: numberFormatter("#,##0.##", jsonData.data.stats.duo.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(jsonData.data.stats.duo.kills / jsonData.data.stats.duo.kd).toString()),
        top1: numberFormatter("#,##0.##", jsonData.data.stats.duo.wins),
        top5: numberFormatter("#,##0.##", jsonData.data.stats.duo.top_5),
        top25: numberFormatter("#,##0.##", jsonData.data.stats.duo.top_25),
        kd: numberFormatter("#,##0.##", jsonData.data.stats.duo.kd),
        kpg: numberFormatter("#,##0.##", jsonData.data.stats.duo.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", jsonData.data.stats.duo.score_per_match),
        matches: numberFormatter("#,##0.##", jsonData.data.stats.duo.matches)
    }
};

const squad = module.exports.squad = (jsonData) => {
    return {
        score: numberFormatter("#,##0.##", jsonData.data.stats.squad.score),
        kills: numberFormatter("#,##0.##", jsonData.data.stats.squad.kills),
        deaths: numberFormatter("#,##0.##", Math.floor(jsonData.data.stats.squad.kills / jsonData.data.stats.squad.kd).toString()),
        top1: numberFormatter("#,##0.##", jsonData.data.stats.squad.wins),
        top5: numberFormatter("#,##0.##", jsonData.data.stats.squad.top_5),
        top25: numberFormatter("#,##0.##", jsonData.data.stats.squad.top_25),
        kd: numberFormatter("#,##0.##", jsonData.data.stats.squad.kd),
        kpg: numberFormatter("#,##0.##", jsonData.data.stats.squad.kills_per_match),
        scorePerMatch: numberFormatter("#,##0.##", jsonData.data.stats.squad.score_per_match),
        matches: numberFormatter("#,##0.##", jsonData.data.stats.squad.matches)
    }
};