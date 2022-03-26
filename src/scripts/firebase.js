import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, where, getDocs, addDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import {
    getAuth
} from 'firebase/auth';
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
console.log("firebaseapp is initialized")
const firestore = getFirestore(firebaseApp);
console.log("firestoredb is connected ")
const colRef = collection(firestore, "user-timeline-log")
console.log("firestore collection is fetched ")

async function add_data(userEmail, userId, result, projectIdFunc) {
    var docId = await addDoc(collection(firestore, "user-timeline-log"), {
        user_id : userId,
        user_email: userEmail,
        tabs: result,
        time_stamp: serverTimestamp(),
        project_id: projectIdFunc
    });
    return docId
}

async function userOnlineData( userEmail, userId, projectIdFunc) {
    var docVal = doc(collection(firestore, "user-online"), userId)
    console.log(`userOnlineData ${docVal}`);
    var docId = await setDoc(docVal, {
        user_id : userId,
        user_email: userEmail,
        time_stamp: serverTimestamp(),
        project_id: projectIdFunc
    });
    return docId
}

// function send_data_to_firebase () {
//     console.log("send_data_to_firebase function is called")
//     var result="";
//     chrome.storage.local.get("tabs", function(item) {
//                     if (item["tabs"] !== undefined) {
//                         result = item["tabs"][0].url;
//                     }

//     var userId = auth.userId
//     var t = new Date().getTime();
//     var user_id = userId;
//     add_data(user_id,result);

//     });
// }
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

// chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//    if (msg.action == 'SendIt') {
//       //console.log("Message received!");
//       send_data_to_firebase();
//       sendResponse({farewell: "goodbye"});
//    }
// });

//send_data_Interval();

export{
    auth,
    firestore,
    add_data,
    userOnlineData
}
