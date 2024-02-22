import React, { useState, useEffect } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/authContext';

function ChildViewing() {
  const { currentUser } = useAuth();
  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");
  const [editChildPoints, setEditChildPoints] = useState(""); // State for editing points

  useEffect(() => {
    console.log("Reading children data from database...");
    const childrenCollectionRef = collection(db, "children");
    const q = query(childrenCollectionRef, where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedChildren = [];
      querySnapshot.forEach((doc) => {
        loadedChildren.push({ id: doc.id, ...doc.data() });
      });
      setChildren(loadedChildren);
    });
  
    return () => unsubscribe();
  }, [currentUser]);

  const editChild = (id, name, money, points) => {
    setEditingChildId(id);
    setEditChildName(name);
    setEditChildOwed(money);
    setEditChildPoints(points); // Set initial value for points
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
        points: parseInt(editChildPoints) // Update points
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
            <Card.Text className="text-center">Owed: ${child.money}</Card.Text>
            <Card.Text className="text-center">Points: {child.points}</Card.Text> {/* Show points */}
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
                <Button variant="success" onClick={() => submitEdit(child.id)} className="mb-2 btn-success">
                  <FaEdit className="mr-2" />
                  Submit
                </Button>
                <Button variant="secondary" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </Button>
              </Form>
            ) : (
              <div className="d-flex flex-column align-items-center">
               <Button variant="primary" onClick={() => editChild(child.id, child.name, child.money, child.points)} className="mb-2 custom-button">
  <FaEdit />
</Button>
<Button variant="danger" onClick={() => deleteChild(child.id)} className="mb-2 custom-button">
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
