// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

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

// Initialize Firestore with persistent local cache for offline support & faster loads
let db;
try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
} catch (e) {
    // If already initialized (e.g., hot reload), fall back to getFirestore
    db = getFirestore(app);
}

export { db };
