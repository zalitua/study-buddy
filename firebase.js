// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);