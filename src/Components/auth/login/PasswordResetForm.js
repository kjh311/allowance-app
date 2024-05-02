// PasswordResetForm.js

// Importing React library for creating components
import React, { useState } from "react";

// Importing the Firebase function to reset passwords
import { doPasswordReset } from "../../../firebase/auth";

// Defining the PasswordResetForm component
const PasswordResetForm = () => {
  // State variables to manage email input and reset status
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Function to handle the password reset submission
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // Calling the Firebase function to reset the password
      await doPasswordReset(email);
      // Setting the resetSent state to true upon successful password reset
      setResetSent(true);
    } catch (error) {
      // Logging error message to console if password reset fails
      console.error("Error resetting password:", error.message);
    }
  };

  // Rendering the component UI
  return (
    <div>
      {/* Heading for the password reset section */}
      <h2 className="text-center">Reset Password</h2>

      {/* Conditional rendering based on the resetSent state */}
      {resetSent ? (
        // Displaying a message if the reset email has been sent
        <p>Password reset email sent. Check your inbox.</p>
      ) : (
        // Displaying the password reset form if reset email has not been sent
        <form onSubmit={handleReset}>
          {/* Input field to enter the email address */}
          <input
            className="text-center"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Button to submit the password reset request */}
          <button className="text-center" type="submit">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

// Exporting the PasswordResetForm component for use in other parts of the application
export default PasswordResetForm;
