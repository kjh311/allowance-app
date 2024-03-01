// ChildLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";

function ChildLoginPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch the hashed password from Firestore based on the child's ID
      const childId = "uniqueChildId"; // You can replace this with actual logic to determine the child's ID
      const childDoc = await db.collection("children").doc(childId).get();
      const correctPassword = childDoc.data().password; // Assuming you have a "password" field in your child document
      // Compare the entered password with the correct password
      if (password === correctPassword) {
        // Passwords match, redirect to the child page
        navigate(`/child/${childId}`);
      } else {
        // Incorrect password, display an error message
        alert("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Child Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChildLoginPage;
