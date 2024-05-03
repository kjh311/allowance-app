import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ChildTodoList from "../children/ChildTodoList.jsx";
import UserTodosList from "../todos/UserTodosList.jsx";
import { Card } from "react-bootstrap";

function ChildPage() {
  const [imageError, setImageError] = useState(false);
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageError(true);
  };

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
              console.log("Unauthorized access to child data: (childPage)", id);
              navigate("/unauthorized");
            }
          } else {
            console.log(
              "User document not found for current user: (childPage)",
              currentUser.uid
            );
            navigate("/error");
          }
        } else {
          console.log("No such document found for ID: (childPage)", id);
          navigate("/notfound");
        }
      } catch (error) {
        console.error("Error getting child: (childPage)", error);
      }
    };

    fetchChildData();
  }, [id, currentUser, navigate]);

  if (!child) {
    // console.log("Child data not yet loaded...");
    return <div>Loading...</div>;
  }

  // Format the due date
  // let formattedDueDate = "";
  // if (child.dueDate) {
  //   const dueDateObj = new Date(child.dueDate);
  //   formattedDueDate = dueDateObj.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // }

  return (
    <div className="flex justify-center items-center flex-col ">
      <br />
      <br />
      <br />
      <br />
      <br />
      <Card className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-5/6 mb-6 shadow-lg rounded-xl mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative">{/* Your image code */}</div>
            </div>
            <div className="w-full text-center mt-20">
              <br />
              <br />
              <br />
              <div className="text-center mt-2">
                <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
                  {child.name}
                </h3>
              </div>
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div className="p-3 text-center">
                  {/* Your child information */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full ">
                {/* <p className="font-light leading-relaxed text-slate-600 mb-4">
                  An artist of considerable range, Mike is the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                  and records all of his own music, giving it a warm.
                </p> */}
                <ChildTodoList childId={id} jsx="true" />
                {/* <UserTodosList /> */}
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* <ChildTodoList childId={id} jsx="true" /> */}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default ChildPage;
