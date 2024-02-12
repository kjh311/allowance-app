// EmailVerificationForm.js

// Importing React library for creating components
import React from "react";

// Importing the Firebase function to send email confirmation
import { doSendEmailConfirmation } from "../../../firebase/auth";

// Defining the EmailVerificationForm component
const EmailVerificationForm = () => {
  // Function to handle resend verification email button click
  const handleResendVerification = async () => {
    try {
      // Sending the email verification request using Firebase function
      await doSendEmailConfirmation();
      // Logging success message to console
      console.log("Verification email sent.");
    } catch (error) {
      // Logging error message to console if sending email verification fails
      console.error("Error sending verification email:", error.message);
    }
  };

  // Rendering the component UI
  return (
    <div>
      {/* Heading for email verification section */}
      <h2>Email Verification</h2>
      {/* Displaying a message indicating that a verification email has been sent */}
      <p>A verification email has been sent to your inbox.</p>
      {/* Prompting the user to resend the verification email if not received */}
      <p>Didn't receive the email? Click below to resend.</p>
      {/* Button to trigger the resend verification email function */}
      <button onClick={handleResendVerification}>
        Resend Verification Email
      </button>
    </div>
  );
};

// Exporting the EmailVerificationForm component for use in other parts of the application
export default EmailVerificationForm;
