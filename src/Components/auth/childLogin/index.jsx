import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

function ChildLoginPage() {
  const [name, setName] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildCount = async () => {
      try {
        console.log("Reading children count from database...");
        const q = query(collection(db, "children"));
        const childrenSnapshot = await getDocs(q);
        console.log(q);
        console.log(childrenSnapshot);
        // setChildCount(childrenSnapshot.size); // Get the size of the snapshot
      } catch (error) {
        console.error("Error fetching children:", error.message);
      }
    };

    // if (currentUser) {
    //   fetchChildCount();

    //   const unsubscribe = onSnapshot(collection(db, "children"), () => {
    //     fetchChildCount();
    //   });

    //   return () => unsubscribe();
    // }
    fetchChildCount();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch the child document from Firestore based on the entered name
      const childrenRef = db.collection("children");

      // const querySnapshot = await childrenRef.where("name", "==", name).get();
      // console.log(querySnapshot);
      const querySnapshot = await childrenRef
        .where("name", "==", name)
        .get()
        .catch((error) => {
          console.error("Error querying Firestore:", error);
          alert(
            "An error occurred while fetching data. Please try again later."
          );
          return;
        });

      // Check if loginPin matches
      const childDoc = querySnapshot.docs[0]; // Assuming unique names
      const correctLoginPin = childDoc.data().loginPin;

      if (loginPin === correctLoginPin) {
        // Login successful, redirect to the child page
        navigate(`/child/${childDoc.id}`);
      } else {
        // Incorrect loginPin
        alert("Incorrect login pin. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-md w-5/6 p-6 bg-white rounded-lg shadow-md grey-border">
        <h2 className="text-2xl font-semibold mb-4">Child Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 grey-border shadow-lg block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="loginPin" className="block text-gray-700">
              Login Pin:
            </label>
            <input
              type="password"
              id="loginPin"
              className="mt-1 grey-border shadow-lg block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
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
