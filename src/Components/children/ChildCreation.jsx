import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState('');
  const [newChildOwed, setNewChildOwed] = useState('');
  const [newChildPoints, setNewChildPoints] = useState(''); // State for points

  const createChild = async () => {
    try {
      const owed = newChildOwed === '' ? 0 : parseFloat(newChildOwed); // Set default to 0 if empty
      const points = newChildPoints === '' ? 0 : parseInt(newChildPoints); // Set default to 0 if empty
      const childToAdd = {
        id: doc(collection(db, 'children')).id, // Generate a unique ID for the child
        name: newChildName,
        owed: owed,
        points: points, // Add the points field
        userId: currentUser.uid,
        todos: [], // Initialize todos field as an empty array
      };

      await setDoc(doc(db, 'children', childToAdd.id), childToAdd); // Set the document with the generated ID
      console.log('Child created successfully');
      setNewChildName('');
      setNewChildOwed('');
      setNewChildPoints('');
      // Trigger update to children state in TodoCreation component
      if (window.todoCreationUpdateChildren) {
        window.todoCreationUpdateChildren();
      }
    } catch (error) {
      console.error('Error creating child:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="add-child-form rounded-lg border border-gray-300 p-4 mb-4">
            <h1>Create new Child</h1>
            <Form>
              <Form.Group controlId="childNameInput">
                <Form.Label>Child Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter child's name"
                  value={newChildName}
                  onChange={(event) => setNewChildName(event.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="childOwedInput">
                <Form.Label>Amount Owed:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amount owed"
                  value={newChildOwed}
                  onChange={(event) => setNewChildOwed(event.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="childPointsInput"> {/* Input field for points */}
                <Form.Label>Points:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter points"
                  value={newChildPoints}
                  onChange={(event) => setNewChildPoints(event.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={createChild} style={{ marginTop: '10px' }}>
                Create Child
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChildCreation;
