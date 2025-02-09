import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3MBw7WuWPw_kylHWmJfSYkjdOYtiYqxY",
  authDomain: "hackyu-bab39.firebaseapp.com",
  projectId: "hackyu-bab39",
  storageBucket: "hackyu-bab39.firebasestorage.app",
  messagingSenderId: "493786967302",
  appId: "1:493786967302:web:00a95e7c36edd370940287",
  measurementId: "G-7K63JE830Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};