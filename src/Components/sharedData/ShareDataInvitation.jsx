import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  arrayUnion,
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

      // Update consent status to true
      const shareDataRef = doc(db, "sharedData", invitationData.id);
      await updateDoc(shareDataRef, { shareAllow: true, asked: true });

      // Update sharingWith field in users collection for current user
      const currentUserRef = doc(db, "users", currentUser.uid);
      await updateDoc(currentUserRef, {
        sharingWith: arrayUnion(invitationData.userId),
      });

      // Update sharingWith field in users collection for invitation sender
      const senderUserRef = doc(db, "users", invitationData.userId);
      await updateDoc(senderUserRef, {
        sharingWith: arrayUnion(currentUser.uid),
      });

      // Fetch todos for both the sender and the current user
      const senderTodosQuerySnapshot = await getDocs(
        query(
          collection(db, "todos"),
          where("createdBy", "==", invitationData.userId)
        )
      );

      const currentUserTodosQuerySnapshot = await getDocs(
        query(
          collection(db, "todos"),
          where("createdBy", "==", currentUser.uid)
        )
      );

      // Update sharedUsers and createdBy fields for todos belonging to the sender
      senderTodosQuerySnapshot.forEach(async (todoDoc) => {
        const todoData = todoDoc.data();
        const updatedSharedUsers = Array.from(
          new Set([
            ...todoData.sharedUsers,
            currentUser.uid,
            invitationData.userId,
          ])
        );
        await updateDoc(todoDoc.ref, {
          sharedUsers: updatedSharedUsers,
          createdBy: currentUser.uid, // Update createdBy field to current user
        });
      });

      // Update sharedUsers and createdBy fields for todos belonging to the current user
      currentUserTodosQuerySnapshot.forEach(async (todoDoc) => {
        const todoData = todoDoc.data();
        const updatedSharedUsers = Array.from(
          new Set([
            ...todoData.sharedUsers,
            currentUser.uid,
            invitationData.userId,
          ])
        );
        await updateDoc(todoDoc.ref, {
          sharedUsers: updatedSharedUsers,
          createdBy: currentUser.uid, // Update createdBy field to current user
        });
      });

      // Fetch children for both the sender and the current user
      const senderChildrenQuerySnapshot = await getDocs(
        query(
          collection(db, "children"),
          where("userId", "==", invitationData.userId)
        )
      );

      const currentUserChildrenQuerySnapshot = await getDocs(
        query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        )
      );

      // Update sharedUsers field for children belonging to the sender
      senderChildrenQuerySnapshot.forEach(async (childDoc) => {
        const childData = childDoc.data();
        const updatedSharedUsers = Array.from(
          new Set([...childData.sharedUsers, currentUser.uid])
        );
        await updateDoc(childDoc.ref, {
          sharedUsers: updatedSharedUsers,
        });
      });

      // Update sharedUsers field for children belonging to the current user
      currentUserChildrenQuerySnapshot.forEach(async (childDoc) => {
        const childData = childDoc.data();
        const updatedSharedUsers = Array.from(
          new Set([...childData.sharedUsers, invitationData.userId])
        );
        await updateDoc(childDoc.ref, {
          sharedUsers: updatedSharedUsers,
        });
      });

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
