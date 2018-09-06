class Configuration {
    constructor() {
        this._storage = window.localStorage;
        this._username = 'Unknown';
        this._platform = 'PC';
        this._apiKey = '';
        this._updateTime = 5;
        this._challenges = {};
        this.loadConfig()
    }

    setUsername(username) {
        this._username = username;
        return this;
    }

    setPlatform(platform) {
        this._platform = platform;
        return this;
    }

    setApiKey(key) {
        this._apiKey = key;
        return this;
    }

    setUpdateTime(time) {
        this._updateTime = time;
        return this;
    }

    addChallenge(week, challenge) {
        if (!this._challenges[week]) this._challenges[week] = [];
        this._challenges[week].push(challenge);
        return this;
    }

    removeChallenge(week, challenge) {
        if (!this._challenges[week]) this._challenges[week] = [];
        this._challenges[week][challenge] = 0;
        return this;
    }

    setChallenges(obj) {
        this._challenges = obj;
        return this;
    }

    getUsername() {
        return this._username;
    }

    getPlatform() {
        return this._platform;
    }

    getApiKey() {
        return this._apiKey;
    }

    getUpdateTime() {
        return this._updateTime;
    }

    getChallenges() {
        return this._challenges;
    }

    getStorage() {
        return this._storage;
    }

    save() {
        const storage = this._storage;
        storage.setItem("username", this._username);
        storage.setItem("platform", this._platform);
        storage.setItem("apiKey", this._apiKey);
        storage.setItem("updateTime", this._updateTime);
        storage.setItem("challenges", JSON.stringify(this._challenges));
        return this;
    }

    loadConfig(bool = 1) {
        switch (bool) {
            case 0:
                this.f();
                break;
            case 1:
                this.f1();
                break;
            case 2:
                this.f1();
                this.f();
                break;
            default:
                break;
        }
    }

    f() {
        $(`.platform input [value="${this._platform.toUpperCase()}"]`).prop('checked', true);
        $('#username_input').val(this._username);
        $('#updateTime').val(this._updateTime);
        $('#api_key').val(this._apiKey);

        for (let week in this._challenges) {
            if (this._challenges[week].length < 1) continue;
            this._challenges[week].forEach(challenge => {
                $(`[check-box-${week}-${challenge}]`).prop('checked', true);
            });
        }
    }

    f1() {
        const storage = this._storage;
        const username = storage.getItem('username');
        const platform = storage.getItem('platform');
        const apiKey = storage.getItem('apiKey');
        const updateTime = storage.getItem('updateTime');
        let challenges = storage.getItem('challenges');

        this.setUsername((username != null || username != undefined) ? username : '')
            .setPlatform((platform != null || platform != undefined) ? platform : 'pc')
            .setApiKey((apiKey != null || apiKey != undefined) ? apiKey : '')
            .setUpdateTime((updateTime != null || updateTime != undefined) ? updateTime : '5')
            .setChallenges((challenges != null || challenges != undefined) ? JSON.parse(challenges) : {});
    };
}

module.exports = Configuration;