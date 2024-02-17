import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Container, Row, Col } from 'react-bootstrap';
import ChildrenCrud from "../children/ChildrenCrud.jsx";
import ChildCreation from "../children/ChildCreation.jsx";
import ChildViewing from "../children/ChildViewing.jsx";
import ChildCounter from "../children/ChildCounter.jsx";

const Children = () => {
    const { currentUser } = useAuth();

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Children</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ChildCreation />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ChildViewing />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ChildCounter />
                </Col>
            </Row>
        </Container>
    );
};

export default Children;
