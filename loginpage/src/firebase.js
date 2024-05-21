// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrnQucaskZEo8D87m7FhHwDMj8RyN5pzU",
  authDomain: "siss-a83fb.firebaseapp.com",
  projectId: "siss-a83fb",
  storageBucket: "siss-a83fb.appspot.com",
  messagingSenderId: "128055857766",
  appId: "1:128055857766:web:d495b2b38747ec011793a7",
  measurementId: "G-BYVB2LFTVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();

export { app, auth };