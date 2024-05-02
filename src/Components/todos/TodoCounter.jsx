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

        // Add an onSnapshot listener to update userTodosCount
        const unsubscribeUserTodos = onSnapshot(userTodosQuery, (snapshot) => {
          setUserTodosCount(snapshot.size);
        });

        return () => unsubscribeUserTodos();
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

      const unsubscribeChildren = onSnapshot(collection(db, "children"), () => {
        fetchChildrenIds();
      });

      return () => unsubscribeChildren();
    }
  }, [currentUser, childrenIds]);

  // Calculate total todos count by adding userTodosCount and childrenTodosCount
  const totalTodosCount = userTodosCount + childrenTodosCount;

  return (
    <div
      style={{
        fontSize: "36px", // Adjust the font size as needed
        fontWeight: "bold", // Make the number bold
        marginTop: "10px", // Add margin to create space between the header and the number
      }}
    >
      {totalTodosCount}
    </div>
  );
}

export default TodoCounter;
