import React, { useState, useEffect } from "react";
import { Button, Container, Table } from "react-bootstrap";
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
import { IoIosCloseCircle } from "react-icons/io";

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

  const getStatusIcon = (data) => {
    if (data.asked && data.shareAllow) {
      return <FaCheckCircle className="text-green-500" />;
    } else if (data.asked && !data.shareAllow) {
      return <IoIosCloseCircle className="text-red-500" />;
    } else {
      return "Pending";
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Those who are allowed to share your data:
      </h2>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Status</th>
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
                    className="form-control"
                  />
                ) : (
                  <>{data.email}</>
                )}
              </td>
              <td>{getStatusIcon(data)}</td>
              <td>
                {editMode && data.id === editId ? (
                  <Button
                    variant="success"
                    onClick={handleUpdate}
                    className="mr-2"
                  >
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(data.email, data.id)}
                      disabled={editMode}
                      className="mr-2"
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
    </div>
  );
}

export default SharedViewing;
