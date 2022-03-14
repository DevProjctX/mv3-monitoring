import { auth } from '../scripts/firebase.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc } from 'firebase/firestore';

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

document.querySelector('.btn__stopproject').addEventListener('click', () => {
    console.log("Stop button clicked!")
    chrome.storage.local.remove('projectinfo');
    window.location.replace('./popupStartProject.html');
    pingSWtoStop();
})

window.addEventListener('load',() => {
    console.log('inside get function stop project');
    var startStopDisplay = document.querySelector(".project_id_display");
    chrome.storage.local.get(['projectinfo'], function(result){
        console.log('inside get function stop project');
        console.log(result);
        if(result.projectinfo != undefined){
            startStopDisplay.innerHTML = `<strong>ProjectId: ${result.projectinfo}</strong>`
        }
    });
})

function pingSWtoStop(){
    var port = chrome.runtime.connect({
          name: "StopProject"
        });
    port.postMessage("StopProject1");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
    });
}
