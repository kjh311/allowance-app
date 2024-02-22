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

      // Add current user's id to sharedUsers field in children collection
      const childrenRef = collection(db, "children");
      const childrenQuerySnapshot = await getDocs(
        query(childrenRef, where("userId", "==", invitationData.userId))
      );

      childrenQuerySnapshot.forEach(async (childDoc) => {
        const childData = childDoc.data();
        if (
          childData.userId === invitationData.userId ||
          childData.sharedUsers.includes(currentUser.uid)
        ) {
          await updateDoc(childDoc.ref, {
            sharedUsers: arrayUnion(currentUser.uid),
          });
        }
      });

      setError("");
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
