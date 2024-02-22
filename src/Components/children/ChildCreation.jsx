import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState('');
  const [newChildMoney, setNewChildMoney] = useState(''); // Updated state for money
  const [newChildPoints, setNewChildPoints] = useState('');

  const createChild = async () => {
    try {
      const money = newChildMoney === '' ? 0 : parseFloat(newChildMoney); // Updated money field
      const points = newChildPoints === '' ? 0 : parseInt(newChildPoints);
      const childToAdd = {
        id: doc(collection(db, 'children')).id,
        name: newChildName,
        money: money, // Updated field name
        points: points,
        userId: currentUser.uid,
        todos: [],
      };

      await setDoc(doc(db, 'children', childToAdd.id), childToAdd);
      console.log('Child created successfully');
      setNewChildName('');
      setNewChildMoney('');
      setNewChildPoints('');
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
              <Form.Group controlId="childMoneyInput"> {/* Updated form group for money */}
                <Form.Label>Money:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amount of money"
                  value={newChildMoney}
                  onChange={(event) => setNewChildMoney(event.target.value)}
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
