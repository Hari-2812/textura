import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuG8O8qpseW3oIHGyNKNB4Q_72eejGISo",
  authDomain: "textura-new.firebaseapp.com",
  projectId: "textura-new",
  storageBucket: "textura-new.appspot.com",   // FIXED
  messagingSenderId: "828817428728",
  appId: "1:828817428728:web:8747e2d9743044b887ab0d",
  measurementId: "G-6FF17HNKCF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
