import { useEffect } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";

const AuthGoogle = () => {
  useEffect(() => {
    // Get existing instance of AuthUI or create a new one
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());

    // Start the FirebaseUI Auth instance with configuration
    ui.start(".firebase-auth-container", {
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      signInSuccessUrl: "/authenticated", // Redirect URL after successful sign-in
      privacyPolicyUrl: "<your-privacy-policy-url>", // Privacy policy URL
    });
  }, []); // Empty dependency array, runs only once when the component mounts
};
