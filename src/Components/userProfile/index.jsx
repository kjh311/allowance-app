import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Container, Row, Col } from "react-bootstrap";
import ChildCreation from "../children/ChildCreation.jsx";
import UserTodosList from "../todos/UserTodosList.jsx";
import TodoCreation from "../todos/TodoCreation.jsx";
import TodoCounter from "../todos/TodoCounter";
import SharedData from "../sharedData/SharedDataForm.jsx";
import SharedViewing from "../sharedData/SharedViewing.jsx";
import ShareDataInvitation from "../sharedData/ShareDataInvitation.jsx";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./user.scss";

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
      <ShareDataInvitation />
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={12}>
          <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center u ser-card">
            <img
              className="mx-auto rounded-full h-36 w-36 mb-4"
              src={currentUser.photoURL}
              alt="author avatar"
            />
            <div>
              <h3 className="text-white font-medium">
                {currentUser.displayName}
              </h3>
            </div>
            <div className="flex justify-center mt-4 space-x-5">
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
      </Row>
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <ChildCreation
            // style={{ width: "80%" }}
            childrenOptions={childrenOptions}
          />
        </Col>
        <Col md={10} lg={8} xl={6}>
          <TodoCreation childrenOptions={childrenOptions} />
        </Col>
        <Col md={10} lg={8} xl={6}>
          {/* <TodoCounter /> */}
          <UserTodosList currentUser={currentUser} />
        </Col>
        <Col md={10} lg={8} xl={6}>
          <div id="share-div ">
            <div>
              <SharedData />
            </div>
            <br />
            <div>
              <SharedViewing />
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default UserProfile;
