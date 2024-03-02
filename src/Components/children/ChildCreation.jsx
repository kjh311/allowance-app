import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState("");
  const [newChildMoney, setNewChildMoney] = useState("");
  const [newChildPoints, setNewChildPoints] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const createChild = async () => {
    try {
      const money = newChildMoney === "" ? 0 : parseFloat(newChildMoney);
      const points = newChildPoints === "" ? 0 : parseInt(newChildPoints);
      const createdBy = currentUser.displayName || currentUser.email;

      const pin = generateRandomPin(6);

      const childToAdd = {
        id: doc(collection(db, "children")).id,
        name: newChildName,
        money: money,
        points: points,
        userId: currentUser.uid,
        createdBy: createdBy,
        photoURL: photoURL,
        sharedUsers: [currentUser.uid],
        loginPin: pin,
      };

      const currentUserRef = doc(db, "users", currentUser.uid);
      const currentUserDoc = await getDoc(currentUserRef);
      const sharingWithIds = currentUserDoc.data().sharingWith || [];

      childToAdd.sharedUsers.push(...sharingWithIds);

      await setDoc(doc(db, "children", childToAdd.id), childToAdd);

      setNewChildName("");
      setNewChildMoney("");
      setNewChildPoints("");
      setPhotoURL("");

      console.log("Child created successfully");

      console.log("Generated PIN:", pin);

      if (window.todoCreationUpdateChildren) {
        window.todoCreationUpdateChildren();
      }
    } catch (error) {
      console.error("Error creating child:", error);
    }
  };

  function generateRandomPin(length) {
    const digits = "0123456789";
    let pin = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      pin += digits[randomIndex];
    }
    return pin;
  }

  return (
    // <Container>
    // <Row className="justify-content-center">
    // <Col md={8}>
    <div className="add-child-form rounded-lg border border-gray-300 p-4 mb-4 bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-center">Create New Child</h1>
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
        <Form.Group controlId="childPhotoURLInput">
          <Form.Label>Photo URL (optional):</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter child's photo URL"
            value={photoURL}
            onChange={(event) => setPhotoURL(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="childMoneyInput">
          <Form.Label>Money:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter amount of money"
            value={newChildMoney}
            onChange={(event) => setNewChildMoney(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="childPointsInput">
          <Form.Label>Points:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter points"
            value={newChildPoints}
            onChange={(event) => setNewChildPoints(event.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={createChild} className="mt-3 w-100">
          Create Child
        </Button>
      </Form>
    </div>
    //  </Col>
    // </Row>
    // </Container>
  );
}

export default ChildCreation;
