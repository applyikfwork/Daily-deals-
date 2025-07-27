// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6YC6PQL4fetD-iIPvlSI8eeV_ugoX4k0",
    authDomain: "deal-finder-nqltx.firebaseapp.com",
    projectId: "deal-finder-nqltx",
    storageBucket: "deal-finder-nqltx.appspot.com",
    messagingSenderId: "993747337148",
    appId: "1:993747337148:web:bf673db84249d6055df5b9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
