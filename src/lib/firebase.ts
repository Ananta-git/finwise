// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeGLPjtcABiq8eOCbkGmvjt6IuoZCFzk4",
  authDomain: "finwise-8fa5a.firebaseapp.com",
  projectId: "finwise-8fa5a",
  storageBucket: "finwise-8fa5a.firebasestorage.app",
  messagingSenderId: "295963662626",
  appId: "1:295963662626:web:14f3c27ed1bafe70982d7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth & db so you can use in your pages
export const auth = getAuth(app);
export const db = getFirestore(app);