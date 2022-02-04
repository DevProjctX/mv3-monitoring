import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore"
import {
    getAuth
} from 'firebase/auth';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
const firebaseApp = initializeApp({
          apiKey: "AIzaSyCFqdrDM-UZh8mOj12_AbdYu8qvzJE9Z5M",
          authDomain: "personal-test-81fe1.firebaseapp.com",
          databaseURL: "https://personal-test-81fe1-default-rtdb.firebaseio.com",
          projectId: "personal-test-81fe1",
          storageBucket: "personal-test-81fe1.appspot.com",
          messagingSenderId: "175534480516",
          appId: "1:175534480516:web:9cf8b0971d6ff0cfc6f6d1",
          measurementId: "G-BZQJ4NKXGQ"
  });

const auth = getAuth(firebaseApp);
//console.log("firebaseapp is initialized ",firebaseApp)
const db = getFirestore(firebaseApp);
//console.log("firestoredb is connected ",db)

const colRef = collection(db, "db-test1")

async function add_data( user_id, result ) {
    console.log(result)
    await setDoc(doc(colRef, user_id), {
        user_id : user_id,
        tabs: result
    });
    console.log("data added");
}

function send_data_to_firebase () {
    var result="";
    chrome.storage.local.get("tabs", function(item) {
                    if (item["tabs"] !== undefined) {
                        //console.log(item["tabs"]);
                        result = item["tabs"][0].url;
                        //console.log(result)
                    }
    console.log(result)
    var t = new Date().getTime();
    var user_id = "Himanshu_test_"+t.toString();
    add_data(user_id,result);
});
}
/*
function get_data_from_storage( ){
    chrome.storage.local.get("tabs", function(item) {
                var result="";
                if (item["tabs"] !== undefined) {
                    result = item["tabs"][0].url;
                    //console.log(result)
                }
                console.log(result)
                //return result;

                //console.log("stored tabs ",result);
        });
}*/

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
   if (msg.action == 'SendIt') {
      //console.log("Message received!");
      send_data_to_firebase();
      sendResponse({farewell: "goodbye"});
   }
});

//send_data_Interval();

export{
    auth
}
//add_data();
/*const searchButton = document.getElementById("trigger_fire");
searchButton.addEventListener("click",()=>{
  add_data();
})*/

//