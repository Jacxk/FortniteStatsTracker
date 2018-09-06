class StatsEmbed {
    constructor(title, identifier) {
        if (!title || !identifier) throw new Error("title and identifier cannot be null");

        this._title = title;
        this._identifier = identifier;
        this._border_color = 'border-left-red';

        this._fields = [];
    }

    addField(title, description, desc_id = '') {
        if (!title || !description) throw new Error("title and description cannot be null");
        this._fields.push({title: title, description: description, desc_id: desc_id});
        return this;
    }

    setBorderColor(color) {
        this._border_color = 'border-left-' + color;
        return this;
    }

    build(document_id) {
        if (!document_id) throw new Error("document id cannot be null!");

        let html = `<div class="stat-card ${this._border_color ? this._border_color : ''}"><div class="white-text">` +
            `<div class="stat-card-title">${this._title}</div><div class="stat-card-content"><div class="row" style="margin: 0">`;
        this._fields.forEach(field => {
            html += `<div class="col s2"><span class="embed-title">${field.title}</span>` +
                `<h5 class="embed-description" id="${field.desc_id ? this._identifier + field.desc_id : ''}">` +
                `${field.description}</h5></div>`;
        });
        html += '</div></div></div></div>';

        return $(`#${document_id}`).append(html);
    }

}

module.exports = StatsEmbed;