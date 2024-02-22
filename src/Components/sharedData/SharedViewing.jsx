import React, { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import "./Share.scss";

function SharedViewing() {
  const { currentUser } = useAuth();
  const [sharedData, setSharedData] = useState([]);
  const [editEmail, setEditEmail] = useState("");
  const [editId, setEditId] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sharedData"),
      (querySnapshot) => {
        const loadedSharedData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === currentUser.uid) {
            loadedSharedData.push({ id: doc.id, ...data });
          }
        });
        setSharedData(loadedSharedData);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleEdit = (email, id) => {
    setEditEmail(email);
    setEditId(id);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "sharedData", editId), { email: editEmail });
      setEditEmail("");
      setEditId("");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "sharedData", id));
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  };

  return (
    <Container>
      <h2>Those who are allowed to share your data:</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sharedData.map((data, index) => (
            <tr key={data.id}>
              <td>{index + 1}</td>
              <td>
                {editMode && data.id === editId ? (
                  <input
                    type="text"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  <>
                    {data.email}
                    {data.shareAllow && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <p>Sharing</p>
                        <FaCheckCircle className="check-mark" />
                      </div>
                    )}
                  </>
                )}
              </td>
              <td>
                {editMode && data.id === editId ? (
                  <Button variant="success" onClick={handleUpdate}>
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(data.email, data.id)}
                      disabled={editMode}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(data.id)}
                      disabled={editMode}
                    >
                      <FaTrash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default SharedViewing;
