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

    // closeInterval() {
    //     var today = new Date();
    //     var stringDate = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    //     var currentInterval = this.intervals[this.intervals.length - 1];
    //     if (currentInterval != undefined) {
    //         if (currentInterval.split('-')[0] == currentInterval.split('-')[1]) {
    //             this.intervals.pop();
    //             this.intervals.push(currentInterval.split('-')[0] + '-' + stringDate);
    //         }
    //     }
    // }
};