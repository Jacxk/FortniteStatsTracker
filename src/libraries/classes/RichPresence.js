class RichPresence {
    constructor() {
        this.username = 'unknown';
        this.username_f = this.username + this.username.charAt(this.username.length - 1) === 's' ? "'" : "'s";
        this.details = 'Login Screen';
        this.state = 'Idle';
        this.largeImageText = 'Username: unknown';
        this.smallImageText = 'Made by: Jacxk';
        this.platform = "PC";
        this.startTimestamp = new Date();
    }

    login() {
        this.rpc = require('discord-rich-presence')('445298809388400640');
        this.setActivity();
        return this;
    }

    setActivity() {
        const startTimestamp = this.startTimestamp;
        this.options = {
            details: this.details,
            startTimestamp,
            largeImageKey: 'logo_big',
            largeImageText: this.largeImageText,
            smallImageKey: 'logo_small',
            smallImageText: this.smallImageText,
            instance: false,
        };
        this.rpc.updatePresence(this.options);
        return this;
    }

    setLoggedOff() {
        this.setDetails('Login Screen').setSmallImageText('Platform: PC');
        this.setActivity();
        return this;
    }

    setWatchingStats() {
        this.setDetails('Watching Battle Royale stats').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setWatchingNews() {
        this.setDetails('Watching the latest news').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setWatchingChallenges() {
        this.setDetails('Watching season\'s challenges').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setWatchingStore() {
        this.setDetails('Watching the store').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setWatchingChangelog() {
        this.setDetails('Watching the patch notes').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setWatchingNewItems() {
        this.setDetails('Watching the upcoming items').setLargeImageText('Username: ' + this.username)
            .setSmallImageText('Platform: ' + this.platform);
        this.setActivity();
        return this;
    }

    setPlatform(platform) {
        this.platform = platform;
    }

    setState(string) {
        if (!string) return delete this.options.state;
        this.state = string;
        this.options.state = this.state;
        return this;
    }

    setDetails(string) {
        this.details = string;
        return this;
    }

    setSmallImageText(string) {
        this.smallImageText = string;
        return this;
    }

    setLargeImageText(string) {
        this.largeImageText = string;
        return this;
    }

    setWatching() {
        this.largeImageText = this.username;
        this.details = `Watching ${this.username_f} Stats`;
        return this;
    }

    setUsername(username) {
        this.username = username;
        return this;
    }
}

module.exports = RichPresence;