// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

// console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
import {LocalStorage} from importScripts('./storage.js')

var storage = new LocalStorage();
var userTimeline=[];
var trackUserInMillis = 2000
var userId
var projectId
var USER_TIMELINE = "user_timeline"

async function getCurrentTabUrl() {
    let tab
    try {
        let queryOptions = { active: true, currentWindow: true };
        [tab] = await chrome.tabs.query(queryOptions).url;   
    } catch (error) {
        console.error(error)
        tab = null
    }
    console.log("tracking tab", tab)
    return tab;
}

async function addTabToUserTimeline() {
    var tab = await getCurrentTab()
    var currentTabAndTimeArray = [tab.url, Date.now()]
    userTimeline.push(currentTabAndTimeArray)
    storage.saveValue(USER_TIMELINE, userTimeline)
    console.log("Added tab and timestamp")
}

function uploadData(){
    //chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //   if (changeInfo.status == 'complete') {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            //console.log(tabs);
            if(tabs.length){
                chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response)
                    {console.log(response.farewell)});
            }
          });
    //   }
    //});
}

function trackCurrentActivity(){
    setInterval(addTabToUserTimeline, trackUserInMillis)
}

trackCurrentActivity()
