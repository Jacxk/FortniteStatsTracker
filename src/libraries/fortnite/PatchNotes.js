const PatchNotesEmbed = require('../libraries/classes/PatchNotesEmbed');

async function displayNotes() {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://fortnite-public-api.theapinetwork.com/prod09/patchnotes/get",
        "method": "POST",
        "headers": {
            "Authorization": storage.getApiKey()
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": ''
    };

    await $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        if (response.error) {
            errorObject.error = true;
            errorObject.message = response.errorMessage;
            return;
        }

        response.blogList.forEach(patch => {
            new PatchNotesEmbed(patch.title, patch.image, patch.shareDescription, patch.date, patch.externalLink)
                .build('patch_notes');
        });
    });
}
