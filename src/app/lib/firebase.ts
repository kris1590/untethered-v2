// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDUVaFa6NdC0zokELyQBv_AcWPZ8BrCYp4",
    authDomain: "untethered-729b8.firebaseapp.com",
    projectId: "untethered-729b8",
    storageBucket: "untethered-729b8.firebasestorage.app",
    messagingSenderId: "1076842024445",
    appId: "1:1076842024445:web:ce9abbc1c562fde02a9d94",
    measurementId: "G-2VEFC9TPX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };