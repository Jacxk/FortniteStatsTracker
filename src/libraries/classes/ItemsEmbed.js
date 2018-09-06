class ItemsEmbed {
    constructor(name, picture, price) {
        this._name = name;
        this._picture = picture;
        this._price = price;
    }

    build(element_id) {
        if (!element_id) throw new Error("document id cannot be null!");

        let html = `<div class="col s4 items-card"><div class="items-card-img-holder"><img draggable="false" src="${this._picture}" class="items-card-img">` +
            `<div class="items-card-image-desc"><div><span>${this._name}</span></div><div><span>${this._price}</span></div></div></div></div>`;

        return $(`#${element_id}`).append(html);
    }
}

module.exports = ItemsEmbed;