// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAhzVwrDteSUPe-qvxrvKzFCQVCOuYg7E",
  authDomain: "notion-ai-564e1.firebaseapp.com",
  projectId: "notion-ai-564e1",
  storageBucket: "notion-ai-564e1.appspot.com",
  messagingSenderId: "720117326165",
  appId: "1:720117326165:web:6e7c027ee067a8bbca0fdc",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
