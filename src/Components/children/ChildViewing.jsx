import React, { useState, useEffect } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";

function ChildViewing() {
  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");

  useEffect(() => {
    console.log("Reading children data from database...");
    const childrenCollectionRef = collection(db, "children");
    const unsubscribe = onSnapshot(childrenCollectionRef, (querySnapshot) => {
      const loadedChildren = [];
      querySnapshot.forEach((doc) => {
        loadedChildren.push({ id: doc.id, ...doc.data() });
      });
      setChildren(loadedChildren);
    });
  
    return () => unsubscribe();
  }, []);

  const editChild = (id, name, owed) => {
    setEditingChildId(id);
    setEditChildName(name);
    setEditChildOwed(owed);
  };

  const cancelEdit = () => {
    setEditingChildId(null);
  };

  const submitEdit = async (id) => {
    try {
      const childDocRef = doc(db, "children", id);
      await updateDoc(childDocRef, {
        name: editChildName,
        owed: parseFloat(editChildOwed)
      });
      console.log(`Child with ID ${id} updated successfully`);
      setEditingChildId(null);
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
    }
  };

  const deleteChild = async (id) => {
    try {
      await deleteDoc(doc(db, "children", id));
      console.log(`Child with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
    }
  };

  return (
    <Container>
      {children.map((child) => (
        <Card key={child.id} className="border border-gray-300 mb-4 d-flex align-items-center flex-column">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <Card.Title className="text-center">Name: {child.name}</Card.Title>
            <Card.Text className="text-center">Owed: ${child.owed}</Card.Text>
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
                <Button variant="success" onClick={() => submitEdit(child.id)} className="mb-2">
                  <FaEdit className="mr-2" />
                  Submit
                </Button>
                <Button variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              </Form>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <Button variant="primary" onClick={() => editChild(child.id, child.name, child.owed)} className="mb-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => deleteChild(child.id)} className="mb-2">
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