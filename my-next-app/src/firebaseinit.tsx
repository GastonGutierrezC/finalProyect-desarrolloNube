// src/firebaseinit.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebaseconfig";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);


const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics, firestore };
