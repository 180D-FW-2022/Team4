import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDatabase, ref, onValue, get, on } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDe6yvhZxc0z5cavL17xUlob3K8m4kZy1Y",
    authDomain: "pill-smart.firebaseapp.com",
    databaseURL: "https://pill-smart-default-rtdb.firebaseio.com",
    projectId: "pill-smart",
    storageBucket: "pill-smart.appspot.com",
    messagingSenderId: "442471702404",
    appId: "1:442471702404:web:a4271dd704ac0d805687d1",
    measurementId: "G-S5WK8XZ29Q"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const realtimeDB = getDatabase(app);
const weightRef = ref(realtimeDB, 'pill-data/');

//To retrieve data from Firebase Realtime database
//when there is an update in data
onValue(weightRef, (snapshot) => {
  console.log("123")
  const data = snapshot.val();
  console.log("Here is the data: ");
  console.log(data["compartment-1"]["weight"]);
  //updateDistance(postElement, data);
}, (error) => {
  console.error(error);
});

export { db }