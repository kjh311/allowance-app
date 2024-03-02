import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
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
  const [decryptedPasswords, setDecryptedPasswords] = useState({});

  useEffect(() => {
    console.log("Reading children data from database...");
    const childrenCollectionRef = collection(db, "children");
    const q = query(
      childrenCollectionRef,
      where("sharedUsers", "array-contains", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const loadedChildren = [];
      const decryptedPasswordsCopy = { ...decryptedPasswords };
      for (const doc of querySnapshot.docs) {
        const childData = doc.data();
        // No need to decrypt PIN, just assign it
        decryptedPasswordsCopy[doc.id] = childData.loginPin;
        // Retrieve todos associated with this child
        const todosQuerySnapshot = await getDocs(
          query(collection(db, "todos"), where("assignedTo", "==", doc.id))
        );
        const todosCount = todosQuerySnapshot.docs.length;
        loadedChildren.push({ id: doc.id, ...childData, todosCount });
      }
      setChildren(loadedChildren);
      setDecryptedPasswords(decryptedPasswordsCopy);
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
      const confirmation = window.confirm(
        "Are you sure you want to delete this Child?"
      );
      if (confirmation) {
        await deleteDoc(doc(db, "children", id));
        console.log(`Child with ID ${id} deleted successfully`);
      }
    } catch (error) {
      console.error(`Error deleting Child with ID ${id}:`, error.message);
    }
  };

  return (
    <div>
      {children.map((child) => (
        <div
          key={child.id}
          className="bg-white rounded-lg shadow-lg mb-6 p-4 w-full md:max-w-md lg:max-w-2xl mx-auto"
        >
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">{child.name}</h2>
            {child.photoURL && (
              <img
                src={child.photoURL}
                alt="child avatar"
                className="rounded-full w-36"
              />
            )}
            <p className="text-gray-600 mt-2">Owed: ${child.money}</p>
            <p className="text-gray-600">Points: {child.points}</p>
            <p className="text-gray-600">Todos: {child.todosCount}</p>
            <p className="text-gray-600">
              Login Pin: {decryptedPasswords[child.id]}
            </p>
            <Link
              to={`/child/${child.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4 inline-block"
            >
              View Details
            </Link>
          </div>
          <div className="flex justify-center mt-4">
            {editingChildId === child.id ? (
              <Form className="flex flex-col items-center">
                <Form.Label className="mb-2">Child's Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter child's name"
                  value={editChildName}
                  onChange={(event) => setEditChildName(event.target.value)}
                  className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                />
                <Form.Label className="mb-2">Money Owed:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount owed"
                  value={editChildOwed}
                  onChange={(event) => setEditChildOwed(event.target.value)}
                  className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                />
                <Form.Label className="mb-2">Points:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter points"
                  value={editChildPoints}
                  onChange={(event) => setEditChildPoints(event.target.value)}
                  className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                />
                <Form.Label className="mb-2">Photo URL:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter child's photo URL"
                  value={editChildPhotoURL}
                  onChange={(event) => setEditChildPhotoURL(event.target.value)}
                  className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                />
                <Button
                  variant="success"
                  onClick={() => submitEdit(child.id)}
                  className="mb-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                >
                  <FaEdit className="mr-2" />
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <div className="flex">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mr-2"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteChild(child.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                >
                  <FaTrash />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChildViewing;
