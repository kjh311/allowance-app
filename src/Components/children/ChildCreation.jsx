import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState("");
  const [newChildMoney, setNewChildMoney] = useState("");
  const [newChildPoints, setNewChildPoints] = useState("");
  const [photoURL, setPhotoURL] = useState(""); // State for photo URL

  const createChild = async () => {
    try {
      const money = newChildMoney === "" ? 0 : parseFloat(newChildMoney);
      const points = newChildPoints === "" ? 0 : parseInt(newChildPoints);

      // Determine the name to use for createdBy field
      const createdBy = currentUser.displayName || currentUser.email;

      const childToAdd = {
        id: doc(collection(db, "children")).id,
        name: newChildName,
        money: money,
        points: points,
        userId: currentUser.uid,
        createdBy: createdBy, // Add createdBy field with user's name or email
        photoURL: photoURL,
        sharedUsers: [currentUser.uid], // Initialize sharedUsers array with current user's id
      };

      // Fetch the sharingWith field from the current user's document
      const currentUserRef = doc(db, "users", currentUser.uid);
      const currentUserDoc = await getDoc(currentUserRef);
      const sharingWithIds = currentUserDoc.data().sharingWith || [];

      // Include sharingWith IDs in the sharedUsers field of the new child
      childToAdd.sharedUsers.push(...sharingWithIds);

      // Include the sharedUsers field in the child document
      await setDoc(doc(db, "children", childToAdd.id), childToAdd);

      // Fetch the user document
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If the user document doesn't exist, create it with the children field
        await setDoc(userRef, {
          children: [childToAdd.id],
        });
      } else {
        // If the user document exists, update it with the children field
        await setDoc(
          userRef,
          {
            children: [childToAdd.id],
          },
          { merge: true }
        );
      }

      setNewChildName("");
      setNewChildMoney("");
      setNewChildPoints("");
      setPhotoURL("");

      console.log("Child created successfully");

      if (window.todoCreationUpdateChildren) {
        window.todoCreationUpdateChildren();
      }
    } catch (error) {
      console.error("Error creating child:", error);
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
              <Form.Group controlId="childPhotoURLInput">
                {" "}
                {/* New form group for photo URL */}
                <Form.Label>Photo URL (optional):</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter child's photo URL to display image"
                  value={photoURL}
                  onChange={(event) => setPhotoURL(event.target.value)} // Update the photo URL state
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
