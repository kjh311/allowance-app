import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ChildTodoList from "../children/ChildTodoList.jsx";

function ChildPage() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const childDocRef = doc(db, "children", id);
        const docSnap = await getDoc(childDocRef);
        if (docSnap.exists()) {
          const childData = docSnap.data();
          const childUserId = childData.userId;

          // Fetch the current user's document from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const sharingWith = userData.sharingWith || [];

            // Check if the child belongs to the current user or a user in sharingWith
            if (
              childUserId === currentUser.uid ||
              sharingWith.includes(childUserId)
            ) {
              setChild({ id: docSnap.id, ...childData });
            } else {
              console.log("Unauthorized access to child data:", id);
              navigate("/unauthorized");
            }
          } else {
            console.log(
              "User document not found for current user:",
              currentUser.uid
            );
            navigate("/error");
          }
        } else {
          console.log("No such document found for ID:", id);
          navigate("/notfound");
        }
      } catch (error) {
        console.error("Error getting child:", error);
      }
    };

    fetchChildData();
  }, [id, currentUser, navigate]);

  if (!child) {
    console.log("Child data not yet loaded...");
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <div className="w-96 px-6 py-6 text-center bg-gray-800 rounded-lg lg:mt-0 xl:px-10 mb-8">
        <div className="space-y-4 xl:space-y-6">
          {child.photoURL ? (
            <img
              className="mx-auto rounded-full w-36"
              src={child.photoURL}
              alt="child avatar"
            />
          ) : null}

          <div className="space-y-2">
            <div className="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
              <h3 className="text-white">{child.name}</h3>
            </div>
          </div>
          <div className="text-center text-white">
            {/* <h2 className="text-lg font-bold">Child Details</h2> */}
            {/* <p className="mb-2">Name: {child.name}</p> */}
            <p className="mb-2">Owed: ${child.money}</p>
            <p className="mb-2">Points: {child.points}</p>
          </div>
        </div>
      </div>
      <ChildTodoList childId={id} jsx="true" />
    </div>
  );
}

export default ChildPage;
