import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWhoqEfDgHpEPUebxiSXR8ppGArNW8avg",
    authDomain: "autominds-26405.firebaseapp.com",
    projectId: "autominds-26405",
    storageBucket: "autominds-26405.firebasestorage.app",
    messagingSenderId: "720923691050",
    appId: "1:720923691050:web:e2eda39f5372652b5f1b53",
    measurementId: "G-GESL2VYJX6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
