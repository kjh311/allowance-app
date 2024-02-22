import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Container, Row, Col } from "react-bootstrap";
import ChildCreation from "../children/ChildCreation.jsx";
import UserTodosList from "../todos/UserTodosList.jsx";
import ChildCounter from "../children/ChildCounter.jsx";
import TodoCreation from "../todos/TodoCreation.jsx";
import SharedData from "../sharedData/SharedDataForm.jsx";
import SharedViewing from "../sharedData/SharedViewing.jsx";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [childrenOptions, setChildrenOptions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "children"), (snapshot) => {
      const childrenData = snapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().name,
      }));
      setChildrenOptions(childrenData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container className="mt-5 mb-5">
      <br />
      <br />
      <Row className="justify-content-center">
        <Col md={6} lg={4} xl={3}>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <img
              className="mx-auto rounded-full h-36 w-36"
              src={currentUser.photoURL}
              alt="author avatar"
            />
            <div className="text-center text-lg font-medium leading-6 text-white mt-4">
              <h3>{currentUser.displayName}</h3>
              <p className="text-indigo-300">Web Developer</p>
            </div>
            <div className="flex justify-center mt-5 space-x-5">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400"
              >
                <span className="sr-only">Twitter</span>
                {/* Twitter icon */}
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400"
              >
                <span className="sr-only">GitHub</span>
                {/* GitHub icon */}
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400"
              >
                <span className="sr-only">LinkedIn</span>
                {/* LinkedIn icon */}
              </a>
            </div>
          </div>
        </Col>
        <Col md={10} lg={6} xl={3}>
          <ChildCreation
            style={{ width: "80%" }}
            childrenOptions={childrenOptions}
          />
        </Col>
        <Col md={6} lg={4} xl={3}>
          <ChildCounter />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4} xl={3}>
          <TodoCreation childrenOptions={childrenOptions} />
        </Col>
        {/* <Col md={6} lg={4} xl={3}>
                    <TodoCounter />
                </Col> */}
        <Col md={6} lg={4} xl={3}>
          <UserTodosList currentUser={currentUser} />
        </Col>
        <Col md={6} lg={4} xl={3}>
          <div>
            <SharedData />
          </div>
          <br />
          <div>
            <SharedViewing />
          </div>
        </Col>
      </Row>
      <br />
      <br />
    </Container>
  );
};

export default UserProfile;
