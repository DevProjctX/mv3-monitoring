import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore"
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

//console.log("firebaseapp is initialized ",firebaseApp)
const db = getFirestore(firebaseApp);
console.log("firestoredb is connected ",db)

const colRef = collection(db, "db-test1")

var result;

async function add_data( user_id, tabs ) {
    var t = new Date().getTime();
    /*await setDoc(doc(colRef, user_id), {
        timestamp : t,
        tabs: tabs
    });*/
    console.log("data added");
}

function send_data_Interval(){
    setInterval(send_data_to_firebase, 20000)
}

function send_data_to_firebase () {
    get_data_from_storage( );
    var user_id = "Himanshu_test_";
    add_data(user_id,result);
}

function get_data_from_storage( ){

    chrome.storage.local.get("tabs", function(item) {

                result=[];
                if (item["tabs"] !== undefined) {
                    result = item["tabs"][0];
                }
                //console.log("stored tabs ",result);
        });

}

send_data_Interval();

export{
    firebaseApp
}
//add_data();
/*const searchButton = document.getElementById("trigger_fire");
searchButton.addEventListener("click",()=>{
  add_data();
})*/