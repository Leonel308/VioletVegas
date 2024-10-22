// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfv0HCQN5q17ncdwGWdtHS2LyLbErFgTk",
  authDomain: "violet-vegas.firebaseapp.com",
  projectId: "violet-vegas",
  storageBucket: "violet-vegas.appspot.com",
  messagingSenderId: "1010769661390",
  appId: "1:1010769661390:web:6db2522c086e3d28792f9f",
  measurementId: "G-2QT3BV259H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);