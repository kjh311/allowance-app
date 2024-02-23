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

      // Check if the sharingWith field exists for the invitation sender
      const senderUserRef = doc(db, "users", invitationData.userId);
      const senderUserDoc = await getDoc(senderUserRef);
      if (senderUserDoc.exists()) {
        const senderUserData = senderUserDoc.data();
        if (!senderUserData.sharingWith) {
          // If sharingWith field doesn't exist, create it with an array containing the current user's ID
          await updateDoc(senderUserRef, {
            sharingWith: [currentUser.uid],
          });
        } else {
          // Update sharingWith field in users collection for invitation sender
          await updateDoc(senderUserRef, {
            sharingWith: arrayUnion(currentUser.uid),
          });
        }
      } else {
        // If the invitation sender's document doesn't exist, create it with sharingWith field
        await setDoc(senderUserRef, {
          sharingWith: [currentUser.uid],
        });
      }

      // Update sharedUsers field for todos belonging to the current user
      const currentUserTodosQuerySnapshot = await getDocs(
        query(
          collection(db, "todos"),
          where("createdBy", "==", currentUser.uid)
        )
      );

      currentUserTodosQuerySnapshot.forEach(async (todoDoc) => {
        const todoData = todoDoc.data();
        const updatedSharedUsers = Array.from(
          new Set([...todoData.sharedUsers, invitationData.userId])
        );
        await updateDoc(todoDoc.ref, {
          sharedUsers: updatedSharedUsers,
        });
      });

      // Update sharedUsers field for children belonging to the current user
      const currentUserChildrenQuerySnapshot = await getDocs(
        query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        )
      );

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
