// Importing necessary modules from Firebase
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Function to create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to sign in with Google using OAuth popup
export const doSignInWithGoogle = async () => {
  // Create a new instance of GoogleAuthProvider
  const provider = new GoogleAuthProvider();
  // Sign in with Google using OAuth popup
  const result = signInWithPopup(auth, provider);

  // Return the result, which includes user information
  return result;
};

// Function to sign out the current user
export const doSignOut = () => {
  return auth.signOut();
};

// Function to send a password reset email to the provided email address
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Function to update the password of the current user
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Function to send an email verification to the current user
export const doSendEmailConfirmation = () => {
  return sendEmailVerification(auth.currentUser, {
    // Include the verification URL in the email
    url: `${window.location.origin}/home`,
  });
};

// Function to add user data to Firestore upon registration
export const addUserToFirestore = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userData);
};
