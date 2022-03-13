'use strict';

class CurrentWindowTrack {
    constructor(synced, url) {
        this.url = new Url(url);
    }

    currentTrack(url) {
        var timeMillis = new Date().getTime;
        // var stringDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.intervals.push(url, timeMillis);
    }

};