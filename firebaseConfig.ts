import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDG2w3UUiDFuV2nqRBvmsvFDVwPU7KzAho",
    authDomain: "undercover-82728.firebaseapp.com",
    projectId: "undercover-82728",
    storageBucket: "undercover-82728.firebasestorage.app",
    messagingSenderId: "681326656170",
    appId: "1:681326656170:web:9112706acb0eccc4cceed3",
    measurementId: "G-JQG41D2R7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app); 
