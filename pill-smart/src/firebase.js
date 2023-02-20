import { initializeApp } from "firebase/app"
import { getFirestore, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore"
import { getDatabase, ref, onValue } from "firebase/database"

//Add compartment adding check

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

//To Do:
//* address how to fix the fact that not all compartments will be filled at all times (updateDoc instead of addDoc) - DONE
//* address how to display the cards if all four compartments are not being used at the moment
//* address how to identify and change an update in the unit weight of a pill - DONE
//* address how you need to update weight immediataely when unit is updated in Firestore

//Retrieve the relevant weight data for the compartments
const compOne = doc(db, "pills", "1")
let docSnapOne = await getDoc(compOne);
let weightOne = Number(docSnapOne.data()["unit"])
onSnapshot(doc(db, "pills", "1"), (doc) => {
  weightOne = parseInt(doc.data()["unit"]);
  console.log("Unit weight is: " + weightOne)
})

const compTwo = doc(db, "pills", "2")
let docSnapTwo = await getDoc(compTwo);
let weightTwo = Number(docSnapTwo.data()["unit"])
onSnapshot(doc(db, "pills", "2"), (doc) => {
  weightTwo = parseInt(doc.data()["unit"]);
  console.log("Unit weight is: " + weightTwo)
})

const compThree = doc(db, "pills", "3")
let docSnapThree = await getDoc(compThree);
let weightThree = Number(docSnapThree.data()["unit"])
onSnapshot(doc(db, "pills", "3"), (doc) => {
  weightThree = parseInt(doc.data()["unit"]);
  console.log("Unit weight is: " + weightThree)
})

const compFour = doc(db, "pills", "4")
let docSnapFour = await getDoc(compFour);
let weightFour = Number(docSnapFour.data()["unit"])
onSnapshot(doc(db, "pills", "4"), (doc) => {
  weightFour = parseInt(doc.data()["unit"]);
  console.log("Unit weight is: " + weightFour)
})

//To retrieve data from Firebase Realtime database
//when there is an update in data
let data;
onValue(weightRef, (snapshot) => {
  data = snapshot.val();

  // update the values in the four separate compartments

  //1. get the document JSON object
  //2. calculate the new amount based on the unit weight (round up)
  //3. update the document with the new amount

  //console.log("weight one is" + weightOne)
  //Compartment 1
  let quantity = Math.round(Number(data["compartment-1"]["weight"])/weightOne)
  updateDoc(compOne, {quantity: quantity})

  // //Compartment 2
  quantity = Math.round(Number(data["compartment-2"]["weight"])/weightTwo)
  updateDoc(compTwo, {quantity: quantity})

  // //Compartment 3
  quantity = Math.round(Number(data["compartment-3"]["weight"])/weightThree)
  updateDoc(compThree, {quantity: quantity})

  // //Compartment 4
  quantity = Math.round(Number(data["compartment-4"]["weight"])/weightFour)
  updateDoc(compFour, {quantity: quantity})

}, (error) => {
  console.error(error);
});

export { db, data }