const ChallengeEmbed = require('../libraries/classes/ChallengeEmbed');

async function displayChallenges() {
    let form = new FormData();
    form.append("season", "current");
    form.append("language", "en");

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://fortnite-public-api.theapinetwork.com/prod09/challenges/get",
        "method": "POST",
        "headers": {
            "Authorization": storage.getApiKey()
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    await $.ajax(settings).done(function (response) {
        response = JSON.parse(response);

        if (response.error) {
            errorObject.error = true;
            errorObject.message = response.errorMessage;
            return;
        }

        response = response.challenges;
        let contents = {};

        for (let week in response) {
            let i = 1;
            if (response[week].length < 1) continue;
            contents[week] = [];
            response[week].forEach(challenge => {
                let difficulty = '';
                switch (challenge.difficulty) {
                    case "normal":
                        difficulty = `<span>Difficulty: <span class="orange-text lighten-1">${challenge.difficulty.toUpperCase()}</span></span>`;
                        break;
                    case "hard":
                        difficulty = `<span>Difficulty: <span class="red-text lighten-1">${challenge.difficulty.toUpperCase()}</span></span>`;
                        break;
                    default:
                        difficulty = `<span>Difficulty: ${challenge.difficulty.toUpperCase()}</span>`;
                        break;
                }
                let html = `<div class="row unselectable" style="margin: 10px 0;"><div class="col s1">` +
                    `<div class="row"><div class="center-align"><img draggable="false" style="width: 30px" ` +
                    `src="https://fortnite-public-files.theapinetwork.com/fortnite-br-challenges-star.png"></div>` +
                    `<div style="text-align: center"><span style="font-size: 14px" class="yellow-text lighten-1">` +
                    `${challenge.stars}</span></div></div></div><div class="col s10"><div><span>${challenge.challenge}</span></div>` +
                    `<div>${difficulty}</div></div><div class="col s1"><p><label>` +
                    `<input type="checkbox" data-challenge="${i}" data-week="${week}" challenge-check check-box-${week}-${i}/>` +
                    `<span></span></label></p></div></div>`;

                contents[week].push(html);
                i++;
            });
            new ChallengeEmbed(' ', ' ', week.toUpperCase()).setDescription(contents[week].join('')).build('challenges_col');
        }
        const challengeCheck = $(`[challenge-check]`);

        $('input.select_all_ch').on('click', function () {
            const week = $(this).data('week');
            $(`[data-week="${week}"]`).prop('checked', $(this).prop('checked'));

            challengeCheck.each(function () {
                if ($(this).prop('checked')) storage.addChallenge($(this).data('week'), $(this).data('challenge'));
                else storage.setChallenges({[week]: []})
            });

            if ($(this).prop('checked')) storage.addChallenge($(this).data('week'), $(this).data('challenge'));
            else storage.removeChallenge($(this).data('week'), $(this).data('challenge'));

            storage.save();
        });
        challengeCheck.on('click', function () {
            if ($(this).prop('checked')) storage.addChallenge($(this).data('week'), $(this).data('challenge'));
            else storage.removeChallenge($(this).data('week'), $(this).data('challenge'));
            storage.save();
        });
    });
}