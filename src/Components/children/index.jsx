import React from "react";
import { useAuth } from "../../contexts/authContext";
import { Container, Row, Col } from "react-bootstrap";
import ChildCreation from "../children/ChildCreation.jsx";
import ChildViewing from "../children/ChildViewing.jsx";
// import ChildCounter from "../children/ChildCounter.jsx";
// import "./Child.scss";

const Children = () => {
  const { currentUser } = useAuth();

  return (
    <Container>
      <br />
      <br />
      <br />
      <br />
      <Row className="justify-content-center">
        <Col>{/* <h2>Children</h2> */}</Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={9} xl={6}>
          <ChildCreation />
          <br />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={12} lg={10} xl={6}>
          <ChildViewing />
        </Col>
      </Row>
      {/* <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <ChildCounter />
        </Col>
      </Row> */}
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default Children;
