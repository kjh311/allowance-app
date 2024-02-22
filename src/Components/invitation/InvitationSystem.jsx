import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import "./Invitation.scss";
import { useAuth } from '../../contexts/authContext';

function InvitationSystem() {
  const { currentUser } = useAuth(); // Use the useAuth hook to get the currentUser
  
  const [email, setEmail] = useState('');

  const generateInvitationCode = () => {
    // Generate a random invitation code
    const invitationCode = Math.random().toString(36).substr(2, 8); // Example: "7b4hd92f"

    // Store the invitation information in Firebase
    const invitationData = {
      creatorId: currentUser.uid,
      email,
      code: invitationCode,
      createdAt: serverTimestamp()
    };

    // Add the invitation to the "invitations" collection
    const invitationsCollection = collection(db, 'invitations');
    addDoc(invitationsCollection, invitationData)
      .then(() => {
        console.log('Invitation created successfully!');
        // Optionally, send the invitation link via email or other channels
      })
      .catch(error => {
        console.error('Error creating invitation:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateInvitationCode();
  };

  return (
    <div>
      <h2>Create Invitation</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className='btn-primary'>
          Generate Invitation
        </Button>
      </Form>
    </div>
  );
}

export default InvitationSystem;
