import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


 
const firebaseConfig = {
  apiKey: "AIzaSyBBBt3ueFVF7N21HCbAUMTccSkNNqjDeWQ",
  authDomain: "textura-40687.firebaseapp.com",
  projectId: "textura-40687",
  storageBucket: "textura-40687.appspot.com",   // ✅ FIXED
  messagingSenderId: "702969125738",
  appId: "1:702969125738:web:2dac2b9f0aa9cf0530e313",
  measurementId: "G-6D2ELTKNW7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
