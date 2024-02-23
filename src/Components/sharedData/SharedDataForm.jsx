import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  addDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ShareDataForm() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the email, user ID, shareAllow, asked, and senderEmail to the sharedData collection in Firestore
      await addDoc(collection(db, "sharedData"), {
        email,
        userId: currentUser.uid,
        shareAllow: false,
        asked: false,
        senderEmail: currentUser.email, // Add sender's email
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
    </div>
  );
}

export default ShareDataForm;
