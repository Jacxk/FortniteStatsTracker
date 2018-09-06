class NewsEmbed {
    constructor(title, image, description, time) {
        this._title = title;
        this._image = image;
        this._description = description;
        this._time = $.timeago(parseInt(time));
    }

    build(element_id) {
        if (!element_id) throw new Error("document id cannot be null!");

        let html = `<div class="news_holder"><h4 style="text-align: center" class="white-text">${this._title}</h4>` +
            `<img style="width: 100%" src="${this._image}" draggable="false"><p class="white-text"><span style="font-size: 20px">${this._description}` +
            `<br><br></span><span style="text-align: right;" class="grey-text lighten-1">${this._time}</span></p></div>`;

        return $(`#${element_id}`).append(html);
    }
}

module.exports = NewsEmbed;