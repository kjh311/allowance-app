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
} from "firebase/auth"; // Update import statement to import from "firebase/auth" instead of "firebase/compat/auth"

import { doc, setDoc } from "firebase/firestore";

// Function to create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to sign in with Google
export const doSignInWithGoogle = async () => {
  try {
    // Create a GoogleAuthProvider instance
    const provider = new GoogleAuthProvider(); // Remove 'firebase.auth.' prefix
    // Sign in with Google pop-up window
    const result = await signInWithPopup(auth, provider); // Update to use signInWithPopup from firebase.auth
    // If sign-in is successful, add user data to Firestore
    if (result.user) {
      const userRef = doc(db, `users/${result.user.uid}`); // Update to use 'doc' from firestore instead of 'firestore.doc'
      await setDoc(userRef, {
        displayName: result.user.displayName,
        email: result.user.email,
        sharingWith: result.user.sharingWith,
        // Add other user data as needed
      });
    }
    return result;
  } catch (error) {
    throw new Error("Error signing in with Google: " + error.message);
  }
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
