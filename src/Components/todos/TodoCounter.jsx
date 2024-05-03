import React, { useState, useEffect } from "react";
import {
  collection,
  where,
  query,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function TodoCounter() {
  const { currentUser } = useAuth();
  const [userTodosCount, setUserTodosCount] = useState(0);

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        const userTodosQuery = query(
          collection(db, "todos"),
          where("assignedTo", "==", currentUser.uid)
        );
        const userTodosSnapshot = await getDocs(userTodosQuery);
        setUserTodosCount(userTodosSnapshot.size);

        // Add an onSnapshot listener to update userTodosCount
        const unsubscribeUserTodos = onSnapshot(userTodosQuery, (snapshot) => {
          setUserTodosCount(snapshot.size);
        });

        return () => unsubscribeUserTodos();
      } catch (error) {
        console.error(
          "Error fetching user todos (todoCounter):",
          error.message
        );
      }
    };

    if (currentUser) {
      fetchUserTodos();
    }
  }, [currentUser]);

  return (
    <div
      style={{
        fontSize: "36px", // Adjust the font size as needed
        fontWeight: "bold", // Make the number bold
        marginTop: "10px", // Add margin to create space between the header and the number
      }}
    >
      {userTodosCount}
    </div>
  );
}

export default TodoCounter;
