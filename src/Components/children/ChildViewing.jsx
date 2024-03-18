import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
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
import "./Child.scss";

function ChildViewing() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");
  const [editChildPoints, setEditChildPoints] = useState("");
  const [editChildPhotoURL, setEditChildPhotoURL] = useState("");
  const [editChildWeeklyAllowance, setEditChildWeeklyAllowance] = useState(""); // State for weekly allowance
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const editChild = (id, name, money, points, photoURL, weeklyAllowance) => {
    setEditingChildId(id);
    setEditChildName(name);
    setEditChildOwed(money);
    setEditChildPoints(points);
    setEditChildPhotoURL(photoURL);
    setEditChildWeeklyAllowance(weeklyAllowance); // Set initial value for weekly allowance
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
        photoURL: editChildPhotoURL,
        weeklyAllowance: parseFloat(editChildWeeklyAllowance), // Update weekly allowance
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

  if (loading) {
    return <div className="text-center loading-message">LOADING...</div>;
  }

  return (
    <>
      {children.map((child) => (
        <Col md={12} lg={10} xl={6} key={child.id}>
          <div className="bg-white rounded-lg shadow-lg mb-6 p-4 grey-border">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-2">{child.name}</h2>

              {child.photoURL ? (
                <div
                  className="child-viewing-photo-div rounded-full w-36 h-36"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://icons.veryicon.com/png/o/miscellaneous/font_awesome/child-10.png" +
                      ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <img
                    src={child.photoURL}
                    className="rounded-full w-36 child-pic grey-border"
                    onError={(event) => {
                      event.target.style.visibility = "hidden";
                    }}
                  />
                </div>
              ) : (
                <img
                  className="rounded-full w-36 h-36"
                  src="https://icons.veryicon.com/png/o/miscellaneous/font_awesome/child-10.png"
                  alt="403 Error"
                />
              )}
              <div>
                <br />
                <br />

                <Container>
                  <Row>
                    <Col className="text-center ">
                      <p className="text-gray-600 child-item grey-border">
                        Owed: <br />${child.money.toFixed(2)}
                      </p>
                    </Col>
                    <Col className="text-center">
                      <p className="text-gray-600 child-item grey-border">
                        Points: <br />
                        {child.points}
                      </p>
                    </Col>
                    {child.weeklyAllowance ? (
                      <Col className="text-center">
                        <p className="text-gray-600 child-item grey-border">
                          Weekly Allowance: <br />$
                          {child.weeklyAllowance.toFixed(2)}
                        </p>
                      </Col>
                    ) : null}

                    <Col className="text-center">
                      <p className="text-gray-600 child-item grey-border">
                        Todos: <br />
                        {child.todosCount}
                      </p>
                    </Col>
                    <Col className="text-center">
                      <p className="text-gray-600 child-item grey-border">
                        Login Pin: <br />
                        {decryptedPasswords[child.id]}
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
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
                  <Form.Label className="mb-2">Weekly Allowance:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter weekly allowance"
                    value={editChildWeeklyAllowance}
                    onChange={(event) =>
                      setEditChildWeeklyAllowance(event.target.value)
                    }
                    className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <Form.Label className="mb-2">Photo URL:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter child's photo URL"
                    value={editChildPhotoURL}
                    onChange={(event) =>
                      setEditChildPhotoURL(event.target.value)
                    }
                    className="mb-2 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <div className="flex items-center mb-2 submit-btn-div">
                    <Button
                      variant="success"
                      onClick={() => submitEdit(child.id)}
                      className="child-viewing-submit-btn mr-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded flex items-center"
                    >
                      <FaEdit className="mr-2 submit-react-icon" />
                      Submit
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
                    >
                      Cancel
                    </Button>
                  </div>
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
                        child.photoURL,
                        child.weeklyAllowance
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
        </Col>
      ))}
    </>
  );
}

export default ChildViewing;
