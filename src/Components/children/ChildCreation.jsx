import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { FaPlusCircle } from "react-icons/fa";
import "./Child.scss";
import Accordion from "react-bootstrap/Accordion";

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState("");
  const [newChildMoney, setNewChildMoney] = useState("");
  const [newChildPoints, setNewChildPoints] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const toggleAccordion = () => {
    setAccordionExpanded(!accordionExpanded);
  };

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

  const handleMoneyChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow digits
      setNewChildMoney(value);
    }
  };

  const handlePointsChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow digits
      setNewChildPoints(value);
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
    <div
      className="accordion bg-white rounded-lg shadow-lg"
      id="childCreationAccordion"
    >
      <div className="accordion-item">
        <h2 className="accordion-header" id="childCreationHeading">
          <button
            className="accordion-button"
            type="button"
            onClick={toggleAccordion}
            aria-expanded={accordionExpanded}
            aria-controls="childCreationCollapse"
          >
            <FaPlusCircle />{" "}
            <span className="create-new-child">Create New Child</span>
          </button>
        </h2>
        <div
          id="childCreationCollapse"
          className={`accordion-collapse  ${
            accordionExpanded ? "show" : "collapse"
          }`}
          aria-labelledby="childCreationHeading"
        >
          <div className="accordion-body">
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
                  onChange={handleMoneyChange}
                />
              </Form.Group>
              <Form.Group controlId="childPointsInput">
                <Form.Label>Points:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter points"
                  value={newChildPoints}
                  onChange={handlePointsChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={createChild}
                className="mt-3 w-100"
              >
                Create Child
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildCreation;
