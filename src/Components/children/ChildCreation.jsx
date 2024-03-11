import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import "./Child.scss";
import Accordion from "react-bootstrap/Accordion";

function ChildCreation() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState("");
  const [newChildMoney, setNewChildMoney] = useState("");
  const [newChildPoints, setNewChildPoints] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [weeklyAllowance, setWeeklyAllowance] = useState(""); // New state for weekly allowance
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        weeklyAllowance: parseFloat(weeklyAllowance), // Save weekly allowance
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
      setWeeklyAllowance(""); // Reset weekly allowance after creating child

      console.log("Child created successfully");

      console.log("Generated PIN:", pin);

      if (window.todoCreationUpdateChildren) {
        window.todoCreationUpdateChildren();
      }
      setSuccessMessage("Child Created Successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
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

  const handleWeeklyAllowanceChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      // Only allow digits and decimals
      setWeeklyAllowance(value);
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
    <Accordion className="bg-white rounded-lg shadow-lg">
      <Accordion.Item eventKey="0">
        <Accordion.Header
          onClick={toggleAccordion}
          className="d-flex align-items-center justify-content-center"
        >
          {accordionExpanded ? (
            <FaMinusCircle className="mr-2" />
          ) : (
            <FaPlusCircle className="mr-2" />
          )}{" "}
          <span className="create-new-child">Create New Child</span>
        </Accordion.Header>

        <Accordion.Body>
          <Form>
            <Form.Group controlId="childNameInput">
              <Form.Label>Child Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter child's name"
                value={newChildName}
                onChange={(event) => setNewChildName(event.target.value)}
                required
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
              <Form.Label>Money (Optional):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter amount of money that the child is owed"
                value={newChildMoney}
                onChange={handleMoneyChange}
              />
            </Form.Group>
            <Form.Group controlId="childPointsInput">
              <Form.Label>Points (Optional):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter points the child has earned"
                value={newChildPoints}
                onChange={handlePointsChange}
              />
            </Form.Group>
            <Form.Group controlId="childWeeklyAllowanceInput">
              {" "}
              {/* New form group for weekly allowance */}
              <Form.Label>Weekly Allowance (Optional):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter weekly allowance"
                value={weeklyAllowance}
                onChange={handleWeeklyAllowanceChange}
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
          {successMessage && (
            <div className="text-success text-center">{successMessage}</div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default ChildCreation;
