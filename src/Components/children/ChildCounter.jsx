import React, { useState, useEffect } from "react";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore"; // Add query to the import statement
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ChildCounter() {
  const { currentUser } = useAuth();
  const [childCount, setChildCount] = useState(0);

  useEffect(() => {
    const fetchChildCount = async () => {
      try {
        // console.log("Reading children count from database...");
        const q = query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        );
        const childrenSnapshot = await getDocs(q);
        setChildCount(childrenSnapshot.size); // Get the size of the snapshot
      } catch (error) {
        console.error("Error fetching children:", error.message);
      }
    };

    if (currentUser) {
      fetchChildCount();

      const unsubscribe = onSnapshot(collection(db, "children"), () => {
        fetchChildCount();
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div
      style={
        {
          // border: "1px solid #ccc",
          // borderRadius: "10px",
          // padding: "20px",
          // width: "fit-content",
          // margin: "auto",
          // margin: "20px",
          // textAlign: "center", // Center the text horizontally
        }
      }
    >
      {/* <h2>Total Number of Children:</h2> */}
      <div
        style={{
          fontSize: "36px", // Adjust the font size as needed
          fontWeight: "bold", // Make the number bold
          marginTop: "10px", // Add margin to create space between the header and the number
        }}
      >
        {childCount}
      </div>
    </div>
  );
}

export default ChildCounter;
