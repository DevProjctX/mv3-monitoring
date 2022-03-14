import { auth } from '../scripts/firebase.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

console.log("popup Start project!")

var name = "";

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logged in!');
        console.log("current")
        console.log(user.displayName)
        name = user.displayName;
    } else {
        console.log('No user');
        window.location.replace('./popup.html');    
    }
});

document.querySelector('#sign_out').addEventListener('click', () => {
    auth.signOut();
    window.location.replace('./popup.html');
});

let element = document.getElementById('user');
element.innerHTML += 'Hello ' + name ;

document.querySelector('.btn__startproject').addEventListener('click', () => {
    console.log("start project button clicked!")
    let projectid = document.getElementById("projectid").value;
    chrome.storage.local.set({ projectinfo: projectid});
    chrome.storage.local.get(['projectinfo'], function(result){
        console.log('inside get function');
        console.log(result);
        if(result.projectinfo != undefined){
            window.location.replace('./popupStopProject.html');
        }
    });
    pingSWtoStart(projectid);
})

function pingSWtoStart(projectid){
    var port = chrome.runtime.connect({
        name: "StartProject"
    });
    port.postMessage(projectid);
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
    });
}
