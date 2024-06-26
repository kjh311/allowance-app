import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth"; // Import Google sign-in function
import { addUserToFirestore } from "../../../firebase/auth";
import "./register.scss";

// Register component
const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [displayName, setDisplayName] = useState(""); // State for user's display name
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistering && password === confirmPassword) {
      setIsRegistering(true);

      try {
        // Call Firebase authentication function for user registration
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );

        // Add user data to Firestore after successful registration
        await addUserToFirestore(userCredential.user.uid, {
          email,
          // displayName,
        });

        // If registration is successful, navigate to the home page
        navigate("/profile");
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    } else {
      setErrorMessage(
        password !== confirmPassword ? "Passwords don't match" : ""
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      await doSignInWithGoogle();
      // Redirect to the home page after successful Google sign-in
      navigate("/profile");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="w-5/6  self-center place-content-center place-items-center">
      <br />
      <br />
      {userLoggedIn && <Navigate to={"/profile"} replace={true} />}

      <main className="w-full register  flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Create a New Account
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {/* <div>
              <label className="text-sm text-gray-600 font-bold">
                Display Name
              </label>
              <input
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div> */}

            <div>
              <label className="text-sm text-gray-600 font-bold">
                Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-bold">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isRegistering
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="text-sm text-center">
              Already have an account? {"   "}
              <Link
                to={"/login"}
                className="text-center text-sm hover:underline font-bold"
              >
                Continue
              </Link>
            </div>

            <div className="text-sm text-center mt-4">
              Or register with Google
              <div>
                <button
                  onClick={signInWithGoogle}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg mt-2"
                >
                  Sign Up with Google
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Register;
