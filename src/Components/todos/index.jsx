import React from "react";
import { useAuth } from "../../contexts/authContext";
import { Container, Row, Col } from "react-bootstrap";
import ToDoCrud from "../todos/ToDoCrud.jsx";
import TodoCreation from "../todos/TodoCreation.jsx";
import TodoViewing from "../todos/TodoViewing.jsx";
import TodoCounter from "../todos/TodoCounter.jsx";
import "./todo.scss";

const ToDos = () => {
  const { currentUser } = useAuth();
  return (
    <Container className="mt-5 mb-5">
      <br />
      <br />
      <br />
      <Row className="justify-content-center">
        <Col md={8} lg={8} xl={8}>
          <div className="">
            <TodoCreation />
            <br />
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={8} xl={8}>
          <div className="">
            <TodoViewing />
          </div>
        </Col>
      </Row>

      <br />
      <br />
    </Container>
  );
};

export default ToDos;
