import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ShareDataForm() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkConsentStatus = async () => {
      try {
        const shareDataRef = collection(db, "sharedData");
        const querySnapshot = await getDocs(
          query(shareDataRef, where("email", "==", currentUser.email))
        );
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (!userData.shareAllow) {
            // Prompt user to provide consent
            setError("Please provide consent to share data.");
          }
        }
      } catch (error) {
        console.error("Error checking consent status:", error);
      }
    };

    if (currentUser) {
      checkConsentStatus();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the email, user ID, and shareAllow to the sharedData collection in Firestore
      await addDoc(collection(db, "sharedData"), {
        email,
        userId: currentUser.uid,
        shareAllow: false,
      });
      setMessage("Email added successfully!");
      setError("");
      setEmail("");
    } catch (error) {
      console.error("Error adding email:", error);
      setError("Error adding email. Please try again.");
      setMessage("");
    }
  };

  const handleConsent = async () => {
    try {
      // Update consent status to true
      const shareDataRef = doc(db, "sharedData", currentUser.email);
      await updateDoc(shareDataRef, { shareAllow: true });
      setError("");
    } catch (error) {
      console.error("Error updating consent status:", error);
      setError("Error updating consent status. Please try again.");
    }
  };

  return (
    <div>
      <h2>Share Data</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Share
        </Button>
      </Form>
      {error && (
        <Button variant="primary" onClick={handleConsent}>
          Give Consent
        </Button>
      )}
    </div>
  );
}

export default ShareDataForm;
