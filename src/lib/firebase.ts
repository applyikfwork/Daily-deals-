// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6YC6PQL4fetD-iIPvlSI8eeV_ugoX4k0",
    authDomain: "deal-finder-nqltx.firebaseapp.com",
    projectId: "deal-finder-nqltx",
    storageBucket: "deal-finder-nqltx.firebasestorage.app",
    messagingSenderId: "993747337148",
    appId: "1:993747337148:web:bf673db84249d6055df5b9"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
