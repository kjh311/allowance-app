import React, { useState, useEffect } from "react";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function TodoCounter() {
  const { currentUser } = useAuth();
  const [userTodosCount, setUserTodosCount] = useState(0);
  const [childrenTodosCount, setChildrenTodosCount] = useState(0);
  const [childrenIds, setChildrenIds] = useState([]);

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        console.log("Reading user todos count from database...");
        const userTodosQuery = query(
          collection(db, "todos"),
          where("assignedTo", "==", currentUser.uid)
        );
        const userTodosSnapshot = await getDocs(userTodosQuery);
        setUserTodosCount(userTodosSnapshot.size);
      } catch (error) {
        console.error("Error fetching user todos:", error.message);
      }
    };

    const fetchChildrenIds = async () => {
      try {
        const childrenQuerySnapshot = await getDocs(
          collection(db, "children").where("userId", "==", currentUser.uid)
        );
        const ids = childrenQuerySnapshot.docs.map((doc) => doc.id);
        setChildrenIds(ids);
      } catch (error) {
        console.error("Error fetching children ids:", error.message);
      }
    };

    const fetchChildrenTodos = async () => {
      try {
        console.log("Reading children todos count from database...");
        const childrenQuerySnapshot = await getDocs(
          query(collection(db, "todos"), where("assignedTo", "in", childrenIds))
        );
        setChildrenTodosCount(childrenQuerySnapshot.size);
      } catch (error) {
        console.error("Error fetching children todos:", error.message);
      }
    };

    if (currentUser) {
      fetchUserTodos();
      fetchChildrenIds();

      const unsubscribe = onSnapshot(collection(db, "children"), () => {
        fetchChildrenIds();
      });

      return () => unsubscribe();
    }
  }, [currentUser, childrenIds]);

  // Calculate total todos count by adding userTodosCount and childrenTodosCount
  const totalTodosCount = userTodosCount + childrenTodosCount;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        width: "fit-content",
        margin: "auto",
        marginTop: "20px",
        textAlign: "center", // Center the text horizontally
        // color: "#fff", // Set the text color to white
      }}
    >
      {/* <h2>Total Number of Todos:</h2> */}
      <div
        style={{
          fontSize: "36px", // Adjust the font size as needed
          fontWeight: "bold", // Make the number bold
          marginTop: "10px", // Add margin to create space between the header and the number
        }}
      >
        {totalTodosCount}
      </div>
    </div>
  );
}

export default TodoCounter;
