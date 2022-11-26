import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

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

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export { db }