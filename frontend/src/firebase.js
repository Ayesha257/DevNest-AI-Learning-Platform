// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Use the SAME Firebase project as your backend
const firebaseConfig = {

  authDomain: "devnest-99574.firebaseapp.com",
  projectId: "devnest-99574",
  storageBucket: "devnest-99574.firebasestorage.app",
  messagingSenderId: "1002599985799",
  appId: "1:1002599985799:web:afa7bafdaecb40dabf3e22",
  measurementId: "G-SVE4PZ1TZV"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;