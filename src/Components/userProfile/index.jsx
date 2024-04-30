import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Container, Row, Col } from "react-bootstrap";
import ChildCreation from "../children/ChildCreation.jsx";
import UserTodosList from "../todos/UserTodosList.jsx";
import TodoCreation from "../todos/TodoCreation.jsx";
import TodoCounter from "../todos/TodoCounter";
import ChildCounter from "../children/ChildCounter";
import SharedData from "../sharedData/SharedDataForm.jsx";
import SharedViewing from "../sharedData/SharedViewing.jsx";
import ShareDataInvitation from "../sharedData/ShareDataInvitation.jsx";
import { collection, where, onSnapshot } from "firebase/firestore";
import Accordion from "react-bootstrap/Accordion";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

import { db } from "../../firebase/firebase";
import "./user.scss";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  console.log(
    "emailDisplayName: " + " " + currentUser.emailDisplayName,
    currentUser
  );
  // console.log("id: " + " " + currentUser.uid);
  // console.log("email: " + " " + currentUser.email);

  const toggleAccordion = () => {
    setAccordionExpanded(!accordionExpanded);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "children"), (snapshot) => {
      const childrenData = snapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().name,
      }));
      setChildrenOptions(childrenData);
    });
    console.log(currentUser);

    return () => unsubscribe();
  }, []);

  return (
    <Container className="mt-5 mb-5 ">
      <ShareDataInvitation />
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={12}>
          {/* <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center u ser-card">
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
            <div className="flex justify-center mt-4 space-x-5"></div>
          </div> */}
          <div className="d-flex justify-content-center ">
            <div className="bg-white rounded-lg shadow-lg grey-border shadow-xl rounded-lg text-gray-900 w-100">
              <div className="rounded-t-lg h-32 overflow-hidden ">
                <img
                  className="object-cover object-top w-full "
                  src="https://picsum.photos/1200/300
                  "
                  alt="Mountain"
                  onError={(event) => {
                    event.target.style.visibility = "hidden";
                  }}
                />
              </div>
              {currentUser.photoURL ? (
                <div
                  className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png" +
                      ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {currentUser.photoURL ? (
                    <img
                      className="object-cover object-center h-32"
                      src={currentUser.photoURL}
                      alt="user"
                      onError={(event) => {
                        event.target.style.visibility = "hidden";
                      }}
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden user-image-div"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png" +
                      ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              )}
              <div className="text-center mt-2">
                {currentUser.emailDisplayName ? (
                  <h2 className="font-semibold">
                    {currentUser.emailDisplayName}
                  </h2>
                ) : (
                  <h2 className="font-semibold">{currentUser.email}</h2>
                )}

                {/* <p className="text-gray-500">Freelance Web Designer</p> */}
              </div>
              <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                <li className="flex flex-col items-center justify-around">
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      <TodoCounter />
                    </span>
                    <span className="text-sm text-slate-400">Todos</span>
                  </div>
                </li>
                <li className="flex flex-col items-center justify-between">
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      <ChildCounter />
                    </span>
                    {/* <a href="/children" /> */}
                    <span className="text-sm text-slate-400">Children</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <ChildCreation childrenOptions={childrenOptions} />
          <br />
        </Col>
        <br />
        <Col md={10} lg={8} xl={6}>
          <TodoCreation childrenOptions={childrenOptions} />
          <br />
        </Col>

        <Col md={10} lg={8} xl={6}>
          {/* <TodoCounter /> */}
          <UserTodosList currentUser={currentUser} />
        </Col>
        {/* <Col md={10} lg={8} xl={6}>
          <Accordion className="bg-white rounded-lg shadow-lg">
            <Accordion.Item eventKey="0">
              <Accordion.Header
                onClick={toggleAccordion}
                className="d-flex align-items-center justify-content-center"
              >
                {accordionExpanded ? (
                  <FaMinusCircle className="mr-2" />
                ) : (
                  <FaPlusCircle className="mr-2" />
                )}{" "}
                <span className="create-new-child">
                  Share Your Data with other Users
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <SharedData />
                <SharedViewing />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col> */}
      </Row>
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default UserProfile;
