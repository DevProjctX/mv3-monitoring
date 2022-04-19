import {auth} from '../scripts/firebase.js'
import {
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';



setPersistence(auth, browserLocalPersistence)
function init() {
    // Detect auth state
    // save the user when 1st sign in, and then retrieve that user
    // pingSWUserIsAuthenticated();
    console.log("$auth");
    // startAuth(true);
    startAuth()
    const user = auth.currentUser;
    if(user != null){
        window.location.replace('./popupStartProject.html');
    }
    // console.log($auth);
    onAuthStateChanged(auth, user => {
        if (user != null) {
            window.user = user;
            chrome.user = user;
            chrome.send
            console.log(user);
            chrome.storage.local.get(['projectinfo'], function(result){
                if(result.projectinfo != undefined){
                    window.location.replace('./popupStopProject.html');        
                } else{
                    window.location.replace('./popupStartProject.html');
                }
            });
        } else {
            console.log('No user logged in!');
        }
    });
}
init();

document.querySelector('.btn__google').addEventListener('click', () => {
    initFirebaseApp()
});

function initFirebaseApp() {
    // Detect auth state
    onAuthStateChanged(auth, user => {
        if (user != null) {
            console.log(user);
            setPersistence(auth, browserLocalPersistence)
        } else {
            console.log('No user');
            startSignIn()
        }
    });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
    //https://firebase.google.com/docs/auth/web/manage-users
    const user = auth.currentUser;
    if (user) {
        auth.signOut();
    } else {
        startAuth(true);
    }
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        //Token:  This requests an OAuth token from the Chrome Identity API.
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Follows: https://firebase.google.com/docs/auth/web/google-signin
            // Authorize Firebase with the OAuth Access Token.
            // console.log("TOKEN:")
            // console.log(token)
            // Builds Firebase credential with the Google ID token.
            const credential = GoogleAuthProvider.credential(null, token);
            signInWithCredential(auth, credential).then((result) => {
                chrome.storage.sync.set({uid: result.user.uid});
                console.log("Success!!!")
                console.log(result)
            }).catch((error) => {
                // You can handle errors here
                console.log(error)
            });
        } else {
            console.error('The OAuth token was null');
        }
    });
}

function pingSWUserAuth(projectid){
    var port = chrome.runtime.connect({
        name: "Authenticated"
    });
    var user = auth.currentUser;
    port.postMessage({userId: user.uid, userEmail: user.email});
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
    });
}

function pingSWUserIsAuthenticated(){
    var port = chrome.runtime.connect({
        name: "IsAuthenticated"
    });
    var userAuthenticated = false;
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        userAuthenticated = msg.userAuthenticated
    });
    return userAuthenticated;
}