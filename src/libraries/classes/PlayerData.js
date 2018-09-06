class PlayerData {
    constructor(username, platform, id = '') {
        if (!username) throw "Username cannot be empty";
        this._lifestats = null;
        this._soloStats = null;
        this._duoStats = null;
        this._squadStats = null;
        this._username = username;
        this._platform = platform;
        this._id = id;
    }

    getUsername() {
        return this._username;
    }

    getPlatform() {
        return this._platform;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
        return this;
    }

    setLifeStats(stats) {
        this._lifestats = stats;
        return this;
    }

    setSoloStats(stats) {
        this._soloStats = stats;
        return this;
    }

    setDuoStats(stats) {
        this._duoStats = stats;
        return this;
    }

    setSquadStats(stats) {
        this._squadStats = stats;
        return this;
    }

    getLifeStats() {
        return this._lifestats;
    }

    getSoloStats() {
        return this._soloStats;
    }

    getDuoStats() {
        return this._duoStats;
    }

    getSquadStats() {
        return this._squadStats;
    }
}

module.exports = PlayerData;