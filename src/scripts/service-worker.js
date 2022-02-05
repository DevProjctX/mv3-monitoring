// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

// console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
import {LocalStorage} from "./storage.js"

var storage = new LocalStorage();
var userTimeline=[];
var trackUserInMillis = 2000
var userId
var projectId
var USER_TIMELINE = "user_timeline"
var USER_OFF_SCREEN = "user_off_screen"

async function getCurrentTabUrl() {
    let tabUrl = ""
    try {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        if (tab == null){
            tabUrl = USER_OFF_SCREEN
        } else {
            tabUrl = tab.url
        };
    } catch (error) {
        console.error(error);
    }
    console.log("tracking tab", tabUrl);
    return tabUrl;
}

async function addTabToUserTimeline() {
    var tabUrl = await getCurrentTabUrl()
    var currentTabAndTimeArray = [tabUrl, Date.now()]
    userTimeline.push(currentTabAndTimeArray)
    storage.saveValue(USER_TIMELINE, userTimeline)
    console.log("Added tab and timestamp")
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab, tab.url)
    return tab;
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
