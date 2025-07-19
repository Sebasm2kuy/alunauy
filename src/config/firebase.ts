// src/config/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwP5TyvyJ0IeRc885z-7O65bAyN2BAf2U",
  authDomain: "alunauy.firebaseapp.com",
  projectId: "alunauy",
  storageBucket: "alunauy.firebasestorage.app",
  messagingSenderId: "250781616795",
  appId: "1:250781616795:web:1726461125f595763cd43e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services to be used in other parts of your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;