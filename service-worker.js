// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

// console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

var proctoringFlag = 0;

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
    if(proctoringFlag==1){setInterval(backgroundCheck, 20000)}
}

function sendMessageInterval(){
    setInterval(sendMessage, 15000)
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab, tab.url)
    return tab;
}

function sendMessage(){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if(tabs.length){
                chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response)
                    {console.log(response.farewell)});
            }
          });
}

function popupconnection(){
    chrome.runtime.onConnect.addListener(function(port) {
          console.log("Connected .....");
          port.onMessage.addListener(function(msg) {
               console.log("message recieved" + msg);
               port.postMessage("Hi Popup.js");
               if(msg=="StartProject")
                    proctoringFlag=1;
               else
                    proctoringFlag=0;
          });
     })
}

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        if (currentWindow.focused && navigator.onLine) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined /*&& activity.isValidPage(activeTab)*/) {
                var activeUrl = activeTab.url;
                var newTab = new Tab(activeUrl);
                tabs.push(newTab);
                //storage.saveTabs(tabs);
            }
        } else {
            console.log("closeIntervalForCurrentTab")
            // activity.closeIntervalForCurrentTab(true);
        }
    });
}

loadTabs();
bgCheckInterval();
popupconnection();
//sendMessageInterval();