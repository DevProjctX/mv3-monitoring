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
    onAuthStateChanged(auth, user => {
        if (user != null) {
            chrome.send
            console.log(`User is logged in: ${user}`)
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
            console.log(`logged in! ${user}`);
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



