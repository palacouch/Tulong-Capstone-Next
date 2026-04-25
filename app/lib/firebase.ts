import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHVyYBupJ7G7-bneYuwXsibqfFA5IzLvA",
  authDomain: "tulong-app-c7aaa.firebaseapp.com",
  projectId: "tulong-app-c7aaa",
  storageBucket: "tulong-app-c7aaa.appspot.com",
  messagingSenderId: "499151598398",
  appId: "1:499151598398:web:49919f7287e5105272726f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);