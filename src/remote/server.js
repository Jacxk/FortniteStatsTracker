const express = require('express');
const request = require('request');
const tokens = require('../../tokens.json');
const app = express();

let apiKey = null;

app.get('/fortnite/v1/p=:platform&u=:username', function (req, res) {

    if (!req.headers['stats-api-key']) {
        console.log(req.headers);
        res.status(400).send({error: 'No api key found on the headers'});
        return;
    }

    if (['true', 'false'].includes(req.headers['own-api-key'])) {
        res.status(406).send({error: 'There was an error with the api key'});
        return;
    }

    if (req.headers['own-api-key'] === 'false' && req.headers['stats-api-key'] !== tokens.apiKey) {
        res.status(406).send({error: 'Incorrect api key'});
        return;
    }

    apiKey = req.headers['stats-api-key'];
    getStats(res, req.params.platform, req.params.username)

});

const server = app.listen(8081, function () {

    const port = server.address().port;

    console.log("App listening at http://%s:%s", 'http://localhost', port)

});

function getStats(res, platform, username) {
    let options = {
        method: 'GET',
        url: `https://api.fortnitetracker.com/v1/profile/${platform.toLowerCase()}/${username.toLowerCase()}`,
        headers: {
            'User-Agent': 'nodejs request',
            'TRN-Api-Key': apiKey
        }
    };

    try {
        request(options, (err, resp, data) => {
            if (err) {
                console.log(err.toString());
                return;
            }
            if (!data) return;

            if (data.toString().includes('<title>Error</title>')) {
                res.status(200).send({error: 'Sorry, an error occurred while processing your request.'});
                return;
            }

            const jsonData = JSON.parse(data);

            if (jsonData.error) {
                res.status(200).send({error: jsonData.error});
                return;
            }

            if (jsonData.message) {
                res.status(200).send({error: jsonData.message});
                return;
            }

            res.status(200).send(JSON.stringify({
                username: username,
                platform: platform,
                lifeTime: lifeTime(jsonData),
                solo: solo(jsonData),
                duo: duo(jsonData),
                squad: squad(jsonData)
            }, null, 2));

        });
    } catch (e) {
        res.status(406).send(e.stack);
    }
}

const lifeTime = (jsonData) => {
    return {
        score: jsonData.lifeTimeStats[6].value,
        kills: jsonData.lifeTimeStats[10].value,
        deaths: Math.floor(parseInt(jsonData.lifeTimeStats[10].value) / parseFloat(jsonData.lifeTimeStats[11].value)).toString(),
        top1: jsonData.lifeTimeStats[0].value,
        top5: jsonData.lifeTimeStats[8].value,
        top25: jsonData.lifeTimeStats[1].value,
        kd: jsonData.lifeTimeStats[11].value,
        matches: jsonData.lifeTimeStats[7].value
    }
};

const solo = (jsonData) => {
    return {
        score: jsonData.stats.p2.score.displayValue,
        kills: jsonData.stats.p2.kills.displayValue,
        deaths: Math.floor(jsonData.stats.p2.kills.valueInt / jsonData.stats.p2.kd.valueDec).toString(),
        top1: jsonData.stats.p2.top1.displayValue,
        top10: jsonData.stats.p2.top10.displayValue,
        top25: jsonData.stats.p2.top25.displayValue,
        kd: jsonData.stats.p2.kd.displayValue,
        kpg: jsonData.stats.p2.kpg.displayValue,
        scorePerMatch: jsonData.stats.p2.scorePerMatch.displayValue,
        matches: jsonData.stats.p2.matches.displayValue
    }
};

const duo = (jsonData) => {
    return {
        score: jsonData.stats.p10.score.displayValue,
        kills: jsonData.stats.p10.kills.displayValue,
        deaths: Math.floor(jsonData.stats.p10.kills.valueInt / jsonData.stats.p10.kd.valueDec).toString(),
        top1: jsonData.stats.p10.top1.displayValue,
        top10: jsonData.stats.p10.top10.displayValue,
        top25: jsonData.stats.p10.top25.displayValue,
        kd: jsonData.stats.p10.kd.displayValue,
        kpg: jsonData.stats.p10.kpg.displayValue,
        scorePerMatch: jsonData.stats.p10.scorePerMatch.displayValue,
        matches: jsonData.stats.p10.matches.displayValue
    }
};

const squad = (jsonData) => {
    return {
        score: jsonData.stats.p9.score.displayValue,
        kills: jsonData.stats.p9.kills.displayValue,
        deaths: Math.floor(jsonData.stats.p9.kills.valueInt / jsonData.stats.p9.kd.valueDec).toString(),
        top1: jsonData.stats.p9.top1.displayValue,
        top10: jsonData.stats.p9.top10.displayValue,
        top25: jsonData.stats.p9.top25.displayValue,
        kd: jsonData.stats.p9.kd.displayValue,
        kpg: jsonData.stats.p9.kpg.displayValue,
        scorePerMatch: jsonData.stats.p9.scorePerMatch.displayValue,
        matches: jsonData.stats.p9.matches.displayValue
    }
};