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
import {firestore, add_data, userOnlineData, isProjectLive, start_project} from "./firebase.js"

var storage = new LocalStorage();
var userTimeline=[];
var trackUserInMillis = 5000
var uploadDataInMillis = 600000
var userOnlineDataTrackMillis = 30000
// var userInfo
var projectId
var userEmail
var userId
var USER_TIMELINE = "user_timeline"
var USER_OFF_SCREEN = "user_off_screen"
var PROJECT_ID = "projectId"
var USER_EMAIL = "userEmail"
var USER_ID = "userId"
var USER_AUTHENTICATED = "userAuthenticated"

async function getCurrentTabUrl() {
    let tabUrl = ""
    try {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        console.log("tab", tab);
        if (tab == null){
            tabUrl = USER_OFF_SCREEN
        } else {
            tabUrl = tab.url
        };
    } catch (error) {
        console.log("gettting tab value error")
        console.error(error);
    }
    console.log("tracking tab", tabUrl);
    return tabUrl;
}

function setUserData(){
  storage.getValue(PROJECT_ID, function(item){
    console.log(`setUserData PROJECT_ID ${item}`);
    projectId = item;
  });

  storage.getValue(USER_EMAIL, function(item){
    // console.log(`USER_EMAIL ${item}`);
    userEmail = item;
  });

  storage.getValue(USER_ID, function(item){
    // console.log(`USER_ID ${item}`);
    userId = item;
  });

  // console.log(`user data is set ${userId}, ${userEmail}, ${projectId}`);
}

function unsetUserData(){
  storage.removeValue(PROJECT_ID);
  storage.removeValue(USER_EMAIL);
  storage.removeValue(USER_ID);
  projectId = undefined;
  userEmail = undefined;
  userId = undefined;
  console.log(`user data is unset $${userId}, ${userEmail}, ${projectId}`);
}

function unsetProjectData(){
  storage.removeValue(PROJECT_ID);
  projectId = undefined;
  console.log(`project data is unset $${userId}, ${userEmail}, ${projectId}`);
}

async function addTabToUserTimeline() {
  setUserData();
  // console.log(`projectId in addTabToUserTimeline ${projectId} ${userEmail}`)
  if(projectId != undefined && userEmail != undefined){
    // var projectStatusRemote = (await isProjectLive(projectId))["status"];
    // console.log(projectStatusRemote);
    // if (projectStatusRemote == 'Live'){
      var url = new Url(await getCurrentTabUrl());
      var urlHost = url.host
      // TODO improve the next statement
      var currentTabAndTimeArray = {timeStamp:Date.now(), url: urlHost}
      userTimeline.push(currentTabAndTimeArray)
      storage.saveValue(USER_TIMELINE, userTimeline)
      // console.log("Added tab and timestamp to localstorage")
      // showUserActivity()  
    // }
    // console.log(`projectId in addTabToUserTimeline after null check ${projectId} ${userEmail}`)
  }
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    // console.log(tab, tab.url)
    return tab;
}

console.log("firestore collection is fetched SW", firestore)

async function addData() {
    setUserData();
    console.log(`addData ${projectId} ${userEmail}`);
    if(projectId != undefined && userEmail != undefined){
      if(projectStatusRemote == 'Ended'){
        unsetProjectData();
      }
      var projectStatusRemote = (await isProjectLive(projectId))["status"];
      if(projectStatusRemote == 'Live'){
        addDataWithProjectId(projectId);
      }
    }
    console.log("data added");
}

async function checkUserOnline() {
  setUserData();
  console.log(`Inside checkUserOnline ${projectId} ${userEmail}`)
  if(projectId != undefined && userEmail!=undefined){
    console.log("Inside of inside checkUserOnline if")
    userOnlineData(userEmail, userId, projectId);
  }
}

async function addDataWithProjectId(projectIdFunc){
  setUserData();
  storage.getValue(USER_TIMELINE, async function(item){
      var docRef = await add_data(userEmail, userId, item, projectIdFunc);
      // console.log("Document Id is", docRef.id)
      if(docRef.id != null){
          userTimeline = []
      }
  });
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
        console.log((memoryInBytes/1024).toFixed(2) + 'Kb');
    });
}

function uploadData(){
    setInterval(addData, uploadDataInMillis)
}

function userOnline(){
  setInterval(checkUserOnline, userOnlineDataTrackMillis)
}

unsetUserData()
trackCurrentActivity()
uploadData()
userOnline()
// setInterval(showUserActivity(), 10000)


let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 85e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
  if(port.name === 'StartProject'){
    port.onMessage.addListener(function(msg){
      start_project(msg.projectId, msg.userId)
      console.log(`StartProject msg ${msg}`);
      storage.saveValue(PROJECT_ID, msg.projectId);
      storage.saveValue(USER_EMAIL, msg.userEmail);
      storage.saveValue(USER_ID, msg.userId);
      console.log(`item set StartProject ${msg}`)
    })
  }
  if(port.name === 'StopProject'){
    setUserData();
    port.onMessage.addListener(function(msg){
      console.log(`StopProject ${msg} `);
      // storage.saveValue(PROJECT_ID, msg);
      console.log(`item set StopProject ${msg}`)
    });
    if(projectId != undefined){
      console.log(`addDataWithProjectId ${projectId}`);
      addDataWithProjectId(projectId)
    }
    unsetUserData();
    // userEmail = undefined;
    // console.log('PROJECT STOPPED');
  }
  // if(port.name === 'Authenticated'){
  //   port.onMessage.addListener(function(msg){
  //     console.log(`Authenticated msg ${msg}`);
  //     storage.saveValue(USER_EMAIL, msg.userEmail);
  //     storage.saveValue(USER_ID, msg.userId);
  //     storage.saveValue(USER_AUTHENTICATED, true);
  //     // console.log(`item set ${msg}`)
  //   })
  // }
  // if(port.name === 'IsAuthenticated'){
  //   port.m
  //   port.onMessage.addListener(function(msg){
      
  //     console.log(`Authenticated msg ${msg}`);
  //     storage.saveValue(USER_EMAIL, msg.userEmail);
  //     storage.saveValue(USER_ID, msg.userId);
  //     storage.saveValue(USER_AUTHENTICATED, true);
  //     // console.log(`item set ${msg}`)
  //   })
  // }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://tools.sabertechs.com/*' })) {
    try {
      console.log(`Keep alive function ${tab.url}`)
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
