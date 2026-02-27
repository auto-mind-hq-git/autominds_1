import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error("Usage: node create_admin.js <email> <password>");
    process.exit(1);
}

async function createAdminUser() {
    try {
        console.log(`Attempting to create user: ${email}...`);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`Success! Admin user created with UID: ${userCredential.user.uid}`);
        console.log("You can now log in to the admin panel with these credentials.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating user:", error.message);
        process.exit(1);
    }
}

createAdminUser();
