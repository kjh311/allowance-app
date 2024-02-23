import React, { useState, useEffect } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

function ChildViewing() {
  const { currentUser } = useAuth();
  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");
  const [editChildPoints, setEditChildPoints] = useState("");
  const [editChildPhotoURL, setEditChildPhotoURL] = useState("");

  useEffect(() => {
    console.log("Reading children data from database...");
    const childrenCollectionRef = collection(db, "children");
    const q = query(
      childrenCollectionRef,
      where("sharedUsers", "array-contains", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const loadedChildren = [];
      for (const doc of querySnapshot.docs) {
        const childData = doc.data();
        // Retrieve todos associated with this child
        const todosQuerySnapshot = await getDocs(
          query(collection(db, "todos"), where("assignedTo", "==", doc.id))
        );
        const todosCount = todosQuerySnapshot.docs.length;
        loadedChildren.push({ id: doc.id, ...childData, todosCount });
      }
      setChildren(loadedChildren);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const editChild = (id, name, money, points, photoURL) => {
    setEditingChildId(id);
    setEditChildName(name);
    setEditChildOwed(money);
    setEditChildPoints(points);
    setEditChildPhotoURL(photoURL); // Set initial value for photo URL
  };

  const cancelEdit = () => {
    setEditingChildId(null);
  };

  const submitEdit = async (id) => {
    try {
      const childDocRef = doc(db, "children", id);
      await updateDoc(childDocRef, {
        name: editChildName,
        money: parseFloat(editChildOwed),
        points: parseInt(editChildPoints),
        photoURL: editChildPhotoURL, // Update photo URL
      });
      console.log(`Child with ID ${id} updated successfully`);
      setEditingChildId(null);
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
    }
  };

  const deleteChild = async (id) => {
    try {
      // Delete the child document
      await deleteDoc(doc(db, "children", id));
      console.log(`Child with ID ${id} deleted successfully`);

      // Remove the child's ID from the children array under the current user's document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        children: firestore.FieldValue.arrayRemove(id),
      });
      console.log(`Child ID ${id} removed from user's children array`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
    }
  };

  return (
    <Container>
      {children.map((child) => (
        <Card
          key={child.id}
          className="border border-gray-300 mb-4 d-flex align-items-center flex-column"
        >
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            {child.photoURL ? (
              <img
                className="mx-auto rounded-full w-36"
                src={child.photoURL}
                alt="child avatar"
              />
            ) : null}
            <Card.Title className="text-center">Name: {child.name}</Card.Title>
            <Card.Text className="text-center">Owed: ${child.money}</Card.Text>
            <Card.Text className="text-center">
              Points: {child.points}
            </Card.Text>
            <Card.Text className="text-center">
              Todos: {child.todosCount}
            </Card.Text>
            <Link to={`/child/${child.id}`} className="btn btn-primary">
              View Details
            </Link>
          </Card.Body>
          <Card.Footer className="d-flex flex-column align-items-center justify-content-center">
            {editingChildId === child.id ? (
              <Form className="d-flex flex-column align-items-center">
                <Form.Group controlId="editChildName" className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Enter child's name"
                    value={editChildName}
                    onChange={(event) => setEditChildName(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="editChildOwed" className="mb-2">
                  <Form.Control
                    type="number"
                    placeholder="Enter amount owed"
                    value={editChildOwed}
                    onChange={(event) => setEditChildOwed(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="editChildPoints" className="mb-2">
                  <Form.Control
                    type="number"
                    placeholder="Enter points"
                    value={editChildPoints}
                    onChange={(event) => setEditChildPoints(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="editChildPhotoURL" className="mb-2">
                  <Form.Label>Photo URL:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter child's photo URL"
                    value={editChildPhotoURL}
                    onChange={(event) =>
                      setEditChildPhotoURL(event.target.value)
                    }
                  />
                </Form.Group>
                <Button
                  variant="success"
                  onClick={() => submitEdit(child.id)}
                  className="mb-2 btn-success"
                >
                  <FaEdit className="mr-2" />
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={cancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <Button
                  variant="primary"
                  onClick={() =>
                    editChild(
                      child.id,
                      child.name,
                      child.money,
                      child.points,
                      child.photoURL
                    )
                  }
                  className="mb-2 custom-button"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteChild(child.id)}
                  className="mb-2 custom-button"
                >
                  <FaTrash />
                </Button>
              </div>
            )}
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
}

export default ChildViewing;
