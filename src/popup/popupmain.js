import { auth } from '../scripts/firebase.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

console.log("popup main!")

var name = "";

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logged in!');
        console.log("current")
        console.log(user.displayName)
        name = user.displayName;
    } else {
        console.log('No user');
        name="";
    }
});

document.querySelector('#sign_out').addEventListener('click', () => {
    auth.signOut();
    window.location.replace('./popup.html');
});

let element = document.getElementById('user');
element.innerHTML += 'Hello ' + name ;

function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

function clickFunction() {
    console.log("button clicked!")
    let projectid = document.getElementById("projectid").value;
    chrome.storage.local.set({ projectinfo: projectid });
    pingSWtoStart();
  }

function pingSWtoStart(){
    var port = chrome.runtime.connect({
          name: "Sample Communication"
        });
    port.postMessage("StartProject");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        });
}

function pingSWtoStop(){
    var port = chrome.runtime.connect({
          name: "Sample Communication"
        });
    port.postMessage("StopProject");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        });
}



/*
<form action=example-server.com">
    <fieldset>
        <legend>Contact me</legend>
        <div class="form-control">
            <label for="name">Name</label>
            <input type="name" id="name" placeholder="Enter your name" required />
        </div>

        <div class="form-control">
            <label for="email">Email</label>
            <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
            />
        </div>

        <div class="form-control">
            <label for="message">Message</label>
            <textarea
                    id="message"
                    cols="30"
                    rows="10"
                    placeholder="Enter your message"
                    required
            ></textarea>
        </div>
        <input type="submit" value="Send" class="submit-btn" />
    </fieldset>
</form>*/