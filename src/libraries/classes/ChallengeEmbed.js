class ChallengeEmbed extends StatsEmbed {
    constructor(title, identifier, week) {
        super(title, identifier);
        this._description = '';
        this._week = week;
    }

    setDescription(text) {
        this._description = text;
        return this;
    }

    build(document_id) {
        if (!document_id) throw new Error("document id cannot be null!");

        let html = `<li><div class="collapsible-header center-align">${this._week}</div>` +
            `<div class="collapsible-body"><p class="right-align"><label>` +
            `<input class="select_all_ch" type="checkbox" data-week="${this._week.toLowerCase()}" data-challenge="-1" challenge-check check-box-${this._week}-${-1}/>` +
            `<span>Select All</span></label></p>` +
            `<div class="stat-card"><div class="white-text">` +
            `<div class="stat-card-content" style="margin: 0;padding: 0;">` +
            `${this._description}</div></div></div></div></li>`;

        return $(`#${document_id}`).append(html);
    }

}

module.exports = ChallengeEmbed;