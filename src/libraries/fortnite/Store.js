async function displayStore() {
    let form = new FormData();
    form.append("language", "en");

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://fortnite-public-api.theapinetwork.com/prod09/store/get",
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

        response.items.forEach(item => {
            new ItemsEmbed(item.name, item.item.images.background, item.cost).build('items_store');
        });
    })
}
