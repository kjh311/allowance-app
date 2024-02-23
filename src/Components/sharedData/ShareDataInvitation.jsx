import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  collection,
  getDocs,
  where,
  query,
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ShareDataInvitation() {
  const { currentUser } = useAuth();
  const [invitationData, setInvitationData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const shareDataRef = collection(db, "sharedData");
        const querySnapshot = await getDocs(
          query(shareDataRef, where("email", "==", currentUser.email))
        );
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (!userData.asked) {
            setInvitationData({ id: querySnapshot.docs[0].id, ...userData });
          }
        }
      } catch (error) {
        console.error("Error checking invitation:", error);
        setError("Error checking invitation. Please try again.");
      }
    };

    if (currentUser) {
      checkInvitation();
    }
  }, [currentUser]);

  const handleAcceptInvitation = async () => {
    try {
      if (!invitationData) {
        console.error("Invitation data is null or undefined.");
        return;
      }

      const currentUserRef = doc(db, "users", currentUser.uid);
      const senderUserRef = doc(db, "users", invitationData.userId);

      // Update sharingWith field for current user
      await updateDoc(currentUserRef, {
        sharingWith: arrayUnion(invitationData.userId),
      });

      // Update sharingWith field for invitation sender
      await updateDoc(senderUserRef, {
        sharingWith: arrayUnion(currentUser.uid),
      });

      // Update sharedUsers field for todos belonging to invitation sender
      const senderUserDoc = await getDoc(senderUserRef);
      const senderUserTodos = senderUserDoc.data().todos;
      if (senderUserTodos) {
        senderUserTodos.forEach(async (todoId) => {
          const todoRef = doc(db, "todos", todoId);
          const todoDoc = await getDoc(todoRef);
          if (todoDoc.exists()) {
            await updateDoc(todoRef, {
              sharedUsers: arrayUnion(currentUser.uid, invitationData.userId),
            });
          }
        });
      }

      // Update sharedUsers field for children belonging to invitation sender
      const senderUserChildren = senderUserDoc.data().children;
      if (senderUserChildren) {
        senderUserChildren.forEach(async (childId) => {
          const childRef = doc(db, "children", childId);
          const childDoc = await getDoc(childRef);
          if (childDoc.exists()) {
            await updateDoc(childRef, {
              sharedUsers: arrayUnion(currentUser.uid, invitationData.userId),
            });
          }
        });
      }

      // Update sharedUsers field for todos belonging to current user
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserTodos = currentUserDoc.data().todos;
      if (currentUserTodos) {
        currentUserTodos.forEach(async (todoId) => {
          const todoRef = doc(db, "todos", todoId);
          const todoDoc = await getDoc(todoRef);
          if (todoDoc.exists()) {
            await updateDoc(todoRef, {
              sharedUsers: arrayUnion(currentUser.uid, invitationData.userId),
            });
          }
        });
      }

      // Update sharedUsers field for children belonging to current user
      const currentUserChildren = currentUserDoc.data().children;
      if (currentUserChildren) {
        currentUserChildren.forEach(async (childId) => {
          const childRef = doc(db, "children", childId);
          const childDoc = await getDoc(childRef);
          if (childDoc.exists()) {
            await updateDoc(childRef, {
              sharedUsers: arrayUnion(currentUser.uid, invitationData.userId),
            });
          }
        });
      }

      // Switch "asked" and "shareAllow" fields to true in sharedData collection
      const shareDataRef = doc(db, "sharedData", invitationData.id);
      await updateDoc(shareDataRef, { asked: true, shareAllow: true });

      setError("");
      setInvitationData(null); // Hide invitation after accepting
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError("Error accepting invitation. Please try again.");
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      if (!invitationData) return; // Check if invitation data exists

      const shareDataRef = doc(db, "sharedData", invitationData.id);
      await updateDoc(shareDataRef, { asked: true });
      setInvitationData(null);
    } catch (error) {
      console.error("Error declining invitation:", error);
      setError("Error declining invitation. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        // borderBottom: "1px solid black",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {invitationData && (
          <div>
            <p>
              You have an invitation to share data with:{" "}
              {invitationData.senderEmail}
            </p>
            <Button variant="success" onClick={handleAcceptInvitation}>
              Accept
            </Button>
            <Button variant="danger" onClick={handleDeclineInvitation}>
              Decline
            </Button>
          </div>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default ShareDataInvitation;
