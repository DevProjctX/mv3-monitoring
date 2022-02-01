import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore"
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


console.log("firebaseapp is initialized ",firebaseApp)

const db = getFirestore(firebaseApp);

console.log("firestoredb is connected ",db)
//replace with your db collection name
const colRef = collection(db, "db-test")

async function add_data() {
  //add data to firestore

    await setDoc(doc(colRef, "SF_bg"), {
        name: "San Francisco", state: "CA", country: "USA",
        capital: false, population: 860000,
        regions: ["west_coast", "norcal"] });

    console.log("data added");
}
add_data();
/*const searchButton = document.getElementById("trigger_fire");
searchButton.addEventListener("click",()=>{
  add_data();
})*/