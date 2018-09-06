const NewsEmbed = require('../libraries/classes/NewsEmbed');

async function displayNews() {
    let form = new FormData();
    form.append("language", "en");

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://fortnite-public-api.theapinetwork.com/prod09/br_motd/get",
        "method": "POST",
        "headers": {
            "Authorization": storage.getApiKey()
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    await $.ajax(settings).done(async function (response) {
        response = JSON.parse(response);
        if (response.error) {
            errorObject.error = true;
            errorObject.message = response.errorMessage;
            return;
        }

        response.entries.forEach(async entry => {
            await new NewsEmbed(entry.title, entry.image, entry.body, entry.time + "000").build('news');
        });
        loading.hide();
    });
}