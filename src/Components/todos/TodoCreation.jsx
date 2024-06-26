import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  getDoc,
  getDocs,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { Accordion, Button, Form } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./todo.scss";
import "./Calendar.scss";

function TodoCreation() {
  const [dueDate, setDueDate] = useState(null);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoMoney, setNewTodoMoney] = useState("");
  const [newTodoPoints, setNewTodoPoints] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [children, setChildren] = useState([]);
  const [sharingWithUsers, setSharingWithUsers] = useState([]);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // console.log(currentUser.sharingWith);
    const fetchData = async () => {
      try {
        if (!currentUser) return;

        // Fetch children of the current user
        const childrenQuery = query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        );
        const childrenSnapshot = await getDocs(childrenQuery);
        const childrenData = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch users listed under the sharingWith field
        const currentUserRef = doc(db, "users", currentUser.uid);
        const currentUserDoc = await getDoc(currentUserRef);
        const sharingWithIds = currentUserDoc.data().sharingWith || [];
        const sharingWithUsersData = [];

        // Loop through the users collection to find users with matching IDs
        const usersQuerySnapshot = await getDocs(collection(db, "users"));
        for (const userDoc of usersQuerySnapshot.docs) {
          const userData = userDoc.data();
          if (sharingWithIds.includes(userDoc.id)) {
            // Fetch children data for the user
            const userChildrenQuery = query(
              collection(db, "children"),
              where("userId", "==", userDoc.id)
            );
            const userChildrenSnapshot = await getDocs(userChildrenQuery);
            const userChildrenData = userChildrenSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Add user with children to sharingWithUsersData
            sharingWithUsersData.push({
              id: userDoc.id,
              displayName: userData.displayName,
              email: userData.email,
              children: userChildrenData,
            });
          }
        }

        // Combine children and users listed under sharingWith into a single array
        const allChildren = [
          ...childrenData,
          ...sharingWithUsersData.flatMap((user) => user.children),
        ];

        setChildren(allChildren);
        setSharingWithUsers(sharingWithUsersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const createTodo = async () => {
    try {
      const createdBy = currentUser.displayName || currentUser.email;

      // Determine assignedTo based on selectedAssignee
      let assignedTo = "";
      if (selectedAssignee) {
        assignedTo = selectedAssignee;
      } else {
        // If "Unassigned" is selected, keep assignedTo as an empty string
        assignedTo = "";
      }

      // Ensure only user IDs are included in sharedUsers
      const filteredSharingWithIds = sharingWithUsers
        .filter((user) => user.id !== currentUser.uid)
        .map((user) => user.id);

      const sharedUsers = [currentUser.uid, ...filteredSharingWithIds];

      // Include formattedDueDate in the todoToAdd object if dueDate is selected
      const todoToAdd = {
        name: newTodoName,
        description: newTodoDescription,
        money: newTodoMoney === "" ? 0 : parseFloat(newTodoMoney),
        points: newTodoPoints === "" ? 0 : parseInt(newTodoPoints),
        assignedTo: assignedTo,
        completed: false,
        sharedUsers: sharedUsers,
        userId: currentUser.uid,
        createdBy: createdBy,
      };

      // If dueDate is selected, include it in the todoToAdd object
      if (dueDate) {
        // Format due date as a readable string
        const formattedDueDate = dueDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        todoToAdd.dueDate = formattedDueDate;
      }

      // Add the todoToAdd object to the "todos" collection in Firestore
      await addDoc(collection(db, "todos"), todoToAdd);
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoMoney("");
      setNewTodoPoints("");
      setDueDate(null); // Reset dueDate after adding the todo
      console.log("Todo created successfully");
      setSuccessMessage("Todo Created Successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedAssignee(event.target.value);
  };

  const toggleAccordion = () => {
    setAccordionExpanded(!accordionExpanded);
  };

  return (
    <Accordion
      defaultActiveKey=""
      className="bg-white rounded-lg shadow-lg"
      expanded={accordionExpanded.toString()}
      onSelect={toggleAccordion}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          {accordionExpanded ? <FaMinusCircle /> : <FaPlusCircle />}{" "}
          <span className="create-new-todo">Create new TODO</span>
        </Accordion.Header>
        <Accordion.Body>
          <Form.Group controlId="todoNameInput">
            <Form.Label>Todo Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter todo name"
              value={newTodoName}
              onChange={(event) => setNewTodoName(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="todoDescriptionInput">
            <Form.Label>Description (optional):</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={newTodoDescription}
              onChange={(event) => setNewTodoDescription(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="todoMoneyInput">
            <Form.Label>Amount of Money (optional):</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount of money"
              value={newTodoMoney}
              onChange={(event) => setNewTodoMoney(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="todoPointsInput">
            <Form.Label>Amount of Points (optional):</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount of points"
              value={newTodoPoints}
              onChange={(event) => setNewTodoPoints(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="todoDueDateInput">
            <Form.Label> Due Date (Optional):</Form.Label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="&#x25BE; Select due date"
            />
          </Form.Group>
          <Form.Group controlId="assigneeDropdown">
            <Form.Label>Assign to:</Form.Label>
            <Form.Control
              as="select"
              value={selectedAssignee}
              onChange={handleDropdownChange}
              // placeholderText="&#x25BE; Unassigned"
            >
              <option value="">Unassigned</option>
              {children.length > 0 ? (
                <optgroup label="Children">
                  {children
                    .filter((child) => child && child.name) // Filter out children without a valid name
                    .map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                </optgroup>
              ) : null}

              <optgroup label="Users">
                {currentUser && (
                  <option key={currentUser.uid} value={currentUser.uid}>
                    {currentUser.displayName || currentUser.email}
                  </option>
                )}
                {sharingWithUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName || user.email}
                  </option>
                ))}
              </optgroup>
            </Form.Control>
          </Form.Group>
          <Button
            onClick={createTodo}
            variant="primary"
            block="true"
            className="mt-3 w-100"
          >
            Add Todo
          </Button>
          {successMessage && (
            <div className="text-success text-center fade-in">
              {successMessage}
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default TodoCreation;
