// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import config from "./config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);

export const db = getFirestore(app);

// export const firestore = initializeApp.firestore();
