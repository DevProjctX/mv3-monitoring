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
import {Url} from "./url.js"
import {firestore, add_data} from "./firebase.js"
import {eventDriven} from "./collect_data.js";

var storage = new LocalStorage();
var userTimeline=[];
var trackUserInMillis = 5000
var uploadDataInMillis = 600000
var userInfo
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
    // console.log("tracking tab", tabUrl);
    return tabUrl;
}

async function addTabToUserTimeline() {
    var url = new Url(await getCurrentTabUrl());
    var urlHost = url.host
    var currentTabAndTimeArray = {timeStamp:Date.now(), url: urlHost}
    userTimeline.push(currentTabAndTimeArray)
    storage.saveValue(USER_TIMELINE, userTimeline)
    console.log("Added tab and timestamp to localstorage")
    showUserActivity()
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    // console.log(tab, tab.url)
    return tab;
}

// function uploadData(){
//     firestore
//     //chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     //   if (changeInfo.status == 'complete') {
//           chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//             //console.log(tabs);
//             if(tabs.length){
//                 chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response)
//                     {console.log(response.farewell)});
//             }
//           });
//     //   }
//     //});
// }

console.log("firestore collection is fetched SW", firestore)

async function addData() {
    // console.log("Adding data")
    
    storage.getValue(USER_TIMELINE, function(item){
        // console.log("uploadingData", typeof(item))
        chrome.identity.getProfileUserInfo(async (userDetails) => {
            userInfo = userDetails
            var docRef = await add_data(userInfo.email, item)
            console.log("Document Id is", docRef.id)
            if(docRef.id != null){
                userTimeline = []
            }
        });
    })
    // console.log("data added");
}

function trackCurrentActivity(){
    setInterval(addTabToUserTimeline, trackUserInMillis)
}

function showUserActivity(){
    storage.getValue(USER_TIMELINE, function(item){
        // console.log("value in USER_TIMELINE", item)
    })
    getMemoryUsed()
}

function getMemoryUsed(){
    storage.getMemoryUse(USER_TIMELINE, function (memoryInBytes) {
        // console.log((memoryInBytes/1024).toFixed(2) + 'Kb');
    });
}

function uploadData(){
    setInterval(addData, uploadDataInMillis)
}

trackCurrentActivity()
uploadData()
// setInterval(showUserActivity(), 10000)


let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}
