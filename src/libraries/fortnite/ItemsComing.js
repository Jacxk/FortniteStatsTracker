const ItemsEmbed = require('../libraries/classes/ItemsEmbed');

async function displayItemsComing() {
    let form = new FormData();
    form.append("language", "en");

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://fortnite-public-api.theapinetwork.com/prod09/upcoming/get",
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

        response.items.forEach(entry => {
            new ItemsEmbed(entry.name, entry.item.images.background, entry.cost).build('upcoming_items');
        });
    });
}
