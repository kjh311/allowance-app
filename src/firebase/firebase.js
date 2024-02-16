import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import config from "../config";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.REACT_APP_API_KEY,
  authDomain: config.REACT_APP_AUTH_DOMAIN,
  projectId: config.REACT_APP_PROJECT_ID,
  storageBucket: config.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: config.REACT_APP_MESSAGING_SENDER_ID,
  appId: config.REACT_APP_APP_ID,
  measurementId: config.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const storage = getStorage(app);
