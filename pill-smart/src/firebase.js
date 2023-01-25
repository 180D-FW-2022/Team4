import { initializeApp } from "firebase/app"
import { getFirestore, collection, updateDoc, doc, getDoc } from "firebase/firestore"
import { getDatabase, ref, onValue, update } from "firebase/database"

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
//* address how to identify and change an update in the unit weight of a pill

//Retrieve the relevant weight data for the compartments
const compOne = doc(db, "pills", "1")
let docSnapOne = await getDoc(compOne);
let weightOne = Number(docSnapOne.data()["unit"])

const compTwo = doc(db, "pills", "2")
let docSnapTwo = await getDoc(compTwo);
let weightTwo = Number(docSnapTwo.data()["unit"])

const compThree = doc(db, "pills", "3")
let docSnapThree = await getDoc(compThree);
let weightThree = Number(docSnapThree.data()["unit"])

const compFour = doc(db, "pills", "4")
let docSnapFour = await getDoc(compFour);
let weightFour = Number(docSnapFour.data()["unit"])

//To retrieve data from Firebase Realtime database
//when there is an update in data
let data;
onValue(weightRef, (snapshot) => {
  data = snapshot.val();

  // update the values in the four separate compartments

  //1. get the document JSON object
  //2. calculate the new amount based on the unit weight (round up)
  //3. update the document with the new amount

  console.log("weight one is" + weightOne)
  //Compartment 1
  let quantity = Math.round(Number(data["compartment-1"]["weight"])/Number(docSnapOne.data()["unit"]))
  updateDoc(compOne, {quantity: quantity})

  // //Compartment 2
  quantity = Math.round(Number(data["compartment-2"]["weight"])/Number(docSnapTwo.data()["unit"]))
  updateDoc(compTwo, {quantity: quantity})

  // //Compartment 3
  quantity = Math.round(Number(data["compartment-3"]["weight"])/Number(docSnapThree.data()["unit"]))
  updateDoc(compThree, {quantity: quantity})

  // //Compartment 4
  quantity = Math.round(Number(data["compartment-4"]["weight"])/Number(docSnapFour.data()["unit"]))
  updateDoc(compFour, {quantity: quantity})

}, (error) => {
  console.error(error);
});

export { db, data }