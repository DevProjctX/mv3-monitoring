import{auth}from"./firebase.js";import{onAuthStateChanged,signInWithCredential,GoogleAuthProvider,setPersistence,browserLocalPersistence}from"firebase/auth";function init(){onAuthStateChanged(auth,(e=>{null!=e?(chrome.send,console.log("Below User is logged in:"),console.log(e),console.log("User print",auth.currentUser)):console.log("No user logged in!")}))}function initFirebaseApp(){onAuthStateChanged(auth,(e=>{null!=e?(console.log("logged in!"),console.log("current"),console.log(e),console.log(e.token)):(console.log("No user"),startSignIn())}))}function startSignIn(){console.log("started SignIn");const e=auth.currentUser;e?(console.log("current"),console.log(e),auth.signOut()):(console.log("proceed"),startAuth(!0))}function startAuth(e){console.log("Auth trying"),chrome.identity.getAuthToken({interactive:!0},(function(o){if(chrome.runtime.lastError&&!e)console.log("It was not possible to get a token programmatically.");else if(chrome.runtime.lastError)console.error(chrome.runtime.lastError);else if(o){const e=GoogleAuthProvider.credential(null,o);signInWithCredential(auth,e).then((e=>{console.log("Success!!!"),console.log(e)})).catch((e=>{console.log(e)}))}else console.error("The OAuth token was null")}))}setPersistence(auth,browserLocalPersistence),init(),document.querySelector(".btn__google").addEventListener("click",(()=>{initFirebaseApp()}));