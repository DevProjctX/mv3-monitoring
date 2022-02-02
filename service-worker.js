// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

class Tab {
    constructor(url, days, summary, counter) {
        this.url = url;

        if (summary !== undefined)
            this.summaryTime = summary;
        else
            this.summaryTime = 0;
        if (counter !== undefined)
            this.counter = counter;
        else
            this.counter = 0;
        if (days !== undefined)
            this.days = days;
        else
            this.days = [];
    }

    incSummaryTime() {
        this.summaryTime += 1;
        var day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined) {
            this.addNewDay(todayLocalDate());
        }
        else {
            day['summary'] += 1;
        }
    }

    getTodayTime(){
        return this.days.find(x => x.date == todayLocalDate()).summary;
    }

    incCounter(){
        this.counter +=1;
        var day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined) {
            this.addNewDay(todayLocalDate());
        }
        else {
            day['counter'] += 1;
        }
    }

    addNewDay(today) {
        this.days.push(
            {
                'date': today,
                'summary': 1,
                'counter': 1
            }
        );
    }
};

class LocalStorage {
    loadTabs(name, callback, callbackIsUndefined) {
        chrome.storage.local.get(name, function(item) {
            if (item[name] !== undefined) {
                var result = item[name];
                if (result !== undefined)
                    callback(result);
            } else {
                if (callbackIsUndefined !== undefined)
                    callbackIsUndefined();
            }
        });
    }

    saveTabs(value, callback) {
        chrome.storage.local.set({ tabs: value });
        if (callback !== undefined)
            callback();
    }

    saveValue(name, value) {
        chrome.storage.local.set({
            [name]: value
        });
    }

    getValue(name, callback) {
        chrome.storage.local.get(name, function(item) {
            if (item !== undefined) {
                callback(item[name]);
            }
        });
    }

    getMemoryUse(name, callback) {
        chrome.storage.local.getBytesInUse(name, callback);
    };
}

var storage = new LocalStorage();
var tabs=[];

function loadTabs() {
    storage.loadTabs('tabs', function(items) {
        tabs = [];
        if (items != undefined) {
            for (var i = 0; i < items.length; i++) {
                var x = new Tab(items[i].url, items[i].days, items[i].summaryTime, items[i].counter)
                tabs.push(x);
            }
            console.log("stored tabs ",tabs);
        }
    });
}

function checkCurrentTab(){
    setInterval(getCurrentTab, 2000)
}

function bgCheckInterval(){
    setInterval(backgroundCheck, 20000)
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab, tab.url)
    return tab;
}

// var tabInfo = checkCurrentTab()
// console.log("Current tab is:-", tabInfo)

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        //console.log("current window", currentWindow)
        if (currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            console.log("current tab", activeTab)
            if (activeTab !== undefined /*&& activity.isValidPage(activeTab)*/) {
                var activeUrl = activeTab.url;

                chrome.scripting.executeScript(
                    {
                      target: {tabId: activeTab.id, allFrames: true},
                      files: ['./dist/bundle.js'],
                    },
                );

                var newTab = new Tab(activeUrl);
                console.log("new tab val is ", newTab)
                tabs.push(newTab);
                //add_data( "himanshu_test", newTab );
                storage.saveTabs(tabs);

                //console.log("active url is bg Check", activeUrl)

            }
        } else activity.closeIntervalForCurrentTab(true);
    });
}

loadTabs();
bgCheckInterval();