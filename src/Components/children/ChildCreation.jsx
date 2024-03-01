import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { hash } from "bcryptjs";

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

      // Generate a random password for the child (6 characters or fewer)
      const password = generateRandomPassword(6);

      // Hash the password before storing it in the database
      const hashedPassword = await hash(password, 10);

      const childToAdd = {
        id: doc(collection(db, "children")).id,
        name: newChildName,
        money: money,
        points: points,
        userId: currentUser.uid,
        createdBy: createdBy,
        photoURL: photoURL,
        sharedUsers: [currentUser.uid],
        loginPassword: hashedPassword, // Store hashed password
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

      // Log the generated password for reference
      console.log("Generated password:", password);

      if (window.todoCreationUpdateChildren) {
        window.todoCreationUpdateChildren();
      }
    } catch (error) {
      console.error("Error creating child:", error);
    }
  };

  // Function to generate a random password
  function generateRandomPassword(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

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
              <Button
                variant="primary"
                onClick={createChild}
                style={{ marginTop: "10px" }}
                className="custom-button btn-primary"
              >
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
