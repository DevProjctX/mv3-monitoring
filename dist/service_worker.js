(()=>{"use strict";var e=new class{saveValue(e,t){chrome.storage.local.set({[e]:t})}getValue(e,t){chrome.storage.local.get(e,(function(a){void 0!==a&&t(a[e])}))}getMemoryUse(e,t){chrome.storage.local.getBytesInUse(e,t)}},t=[];setInterval((async function(){var a=[await async function(){let e="";try{let t={active:!0,currentWindow:!0},[a]=await chrome.tabs.query(t);e=null==a?"user_off_screen":a.url}catch(e){console.error(e)}return console.log("tracking tab",e),e}(),Date.now()];t.push(a),e.saveValue("user_timeline",t),console.log("Added tab and timestamp")}),2e3)})();