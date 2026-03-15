import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHVyYBupJ7G7-bneYuwXsibqfFA5IzLvA",
  authDomain: "tulong-app-c7aaa.firebaseapp.com",
  projectId: "tulong-app-c7aaa",
  storageBucket: "tulong-app-c7aaa.firebasestorage.app",
  messagingSenderId: "499151598398",
  appId: "1:499151598398:web:49919f7287e5105272726f"
};

// Prevents duplicate Firebase initialization in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);