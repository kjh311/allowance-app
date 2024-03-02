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
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function TodoCreation() {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoMoney, setNewTodoMoney] = useState("");
  const [newTodoPoints, setNewTodoPoints] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [children, setChildren] = useState([]);
  const [sharingWithUsers, setSharingWithUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
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

      await addDoc(collection(db, "todos"), todoToAdd);
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoMoney("");
      setNewTodoPoints("");
      console.log("Todo created successfully");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedAssignee(event.target.value);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="add-todo-form bg-white rounded-lg shadow-lg border-gray-300 p-4 mb-4">
            <h1 className="text-center">Create new TODO</h1>
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
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={newTodoDescription}
                onChange={(event) => setNewTodoDescription(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="todoMoneyInput">
              <Form.Label>Amount of Money:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount of money"
                value={newTodoMoney}
                onChange={(event) => setNewTodoMoney(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="todoPointsInput">
              <Form.Label>Amount of Points:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount of points"
                value={newTodoPoints}
                onChange={(event) => setNewTodoPoints(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="assigneeDropdown">
              <Form.Label>Assign to:</Form.Label>
              <Form.Control
                as="select"
                value={selectedAssignee}
                onChange={handleDropdownChange}
              >
                <option value="">Unassigned</option>
                <optgroup label="Children">
                  {children
                    .filter((child) => child && child.name) // Filter out children without a valid name
                    .map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Current User">
                  {currentUser && (
                    <option key={currentUser.uid} value={currentUser.uid}>
                      {currentUser.displayName}
                    </option>
                  )}
                </optgroup>
                <optgroup label="Sharing With">
                  {sharingWithUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName || user.email}
                    </option>
                  ))}
                </optgroup>
              </Form.Control>
            </Form.Group>
            <Button onClick={createTodo} variant="primary" block>
              Add Todo
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TodoCreation;
