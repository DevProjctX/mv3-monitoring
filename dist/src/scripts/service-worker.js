import{LocalStorage}from"./storage.js";import{Url}from"./url.js";import{firestore,add_data}from"./firebase.js";var userInfo,projectId,storage=new LocalStorage,userTimeline=[],trackUserInMillis=5e3,uploadDataInMillis=6e5,USER_TIMELINE="user_timeline",USER_OFF_SCREEN="user_off_screen";async function getCurrentTabUrl(){let e="";try{let t={active:!0,currentWindow:!0},[o]=await chrome.tabs.query(t);e=null==o?USER_OFF_SCREEN:o.url}catch(e){console.error(e)}return console.log("tracking tab",e),e}async function addTabToUserTimeline(){var e=new Url(await getCurrentTabUrl()).host,t={timeStamp:Date.now(),url:e};userTimeline.push(t),storage.saveValue(USER_TIMELINE,userTimeline),console.log("Added tab and timestamp to localstorage"),showUserActivity()}async function getCurrentTab(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return console.log(e,e.url),e}async function addData(){console.log("Adding data"),storage.getValue(USER_TIMELINE,(function(e){console.log("uploadingData",typeof e),chrome.identity.getProfileUserInfo((async t=>{userInfo=t;var o=await add_data(userInfo.email,e);console.log("Document Id is",o.id),null!=o.id&&(userTimeline=[])}))})),console.log("data added")}function trackCurrentActivity(){setInterval(addTabToUserTimeline,trackUserInMillis)}function showUserActivity(){storage.getValue(USER_TIMELINE,(function(e){console.log("value in USER_TIMELINE",e)})),getMemoryUsed()}function getMemoryUsed(){storage.getMemoryUse(USER_TIMELINE,(function(e){console.log((e/1024).toFixed(2)+"Kb")}))}function uploadData(){setInterval(addData,uploadDataInMillis)}console.log("firestore collection is fetched ",firestore),trackCurrentActivity(),uploadData();