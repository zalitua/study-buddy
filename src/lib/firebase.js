// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { applyActionCode, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQTWKDhjSAIC6yFCJRh3DIaopcs9U39qk",
  authDomain: "study-buddy-be9e4.firebaseapp.com",
  projectId: "study-buddy-be9e4",
  storageBucket: "study-buddy-be9e4.appspot.com",
  messagingSenderId: "168752238393",
  appId: "1:168752238393:web:87cbf417e450707b9162e8",
  measurementId: "G-SLE2Z26B03"
};

// Initialize Firebase alt way:(const app = initializeApp(firebaseConfig);)
initializeApp(firebaseConfig);


export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();


