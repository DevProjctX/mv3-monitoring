// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

function checkCurrentTab(){
    setInterval(getCurrentTab, 2000)
}

function bgCheckInterval(){
    setInterval(backgroundCheck, 5000)
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
        console.log("current window", currentWindow)
        if (currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined && activity.isValidPage(activeTab)) {
                var activeUrl = new Url(activeTab.url);
                // var tab = activity.getTab(activeUrl);
                // if (tab === undefined) {
                //     activity.addTab(activeTab);
                // }
                console.log("active url is bg Check", activeUrl)
                // if (activity.isInBlackList(activeUrl)) {
                //     chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                //     chrome.browserAction.setBadgeText({
                //         tabId: activeTab.id,
                //         text: 'n/a'
                //     });
                // } else {
                //     if (tab !== undefined) {
                //         if (!tab.url.isMatch(currentTab)) {
                //             activity.setCurrentActiveTab(tab.url);
                //         }
                //         chrome.idle.queryState(parseInt(setting_interval_inactivity), function(state) {
                //             if (state === 'active') {
                //                 mainTRacker(activeUrl, tab, activeTab);
                //             } else checkDOM(state, activeUrl, tab, activeTab);
                //         });
                //     }
                // }
            }
        } else activity.closeIntervalForCurrentTab(true);
    });
}

bgCheckInterval()