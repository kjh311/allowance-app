import { useEffect, useContext, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";

// Create a context for the authentication
const AuthContext = React.createContext();

// Custom hook to use the authentication context
export function useAuth() {
  return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
  // State to track the current user
  const [currentUser, setCurrentUser] = useState(null);
  // State to track whether a user is logged in
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  // State to track the loading state during authentication initialization
  const [loading, setLoading] = useState(true);

  // useEffect to run once on component mount
  useEffect(() => {
    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, initializeUser);

    // Cleanup function to unsubscribe when the component unmounts
    return unsubscribe;
  }, []);

  // Function to initialize user based on the authentication state
  async function initializeUser(user) {
    // Check if a user is authenticated
    if (user) {
      // Set the current user state with user details
      setCurrentUser({ ...user });
      // Set the userLoggedIn state to true
      setUserLoggedIn(true);
    } else {
      // If no user is authenticated, reset current user state and set userLoggedIn to false
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    // Set loading state to false, indicating that authentication initialization is completed
    setLoading(false);
  }

  // Value object to be provided through the context
  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  // Render the AuthContext.Provider with the provided value
  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
