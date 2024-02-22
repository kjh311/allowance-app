import React from "react";
import Container from "react-bootstrap/Container";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Header.scss";

const Header = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await doSignOut();
      // Redirect to login page after successful logout
      window.location.href = "/home";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Navbar expand="lg" className=" fixed-top navbar" bg="primary">
      <Container>
        <Navbar.Brand className="brand">Allowance App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/todos">
              ToDos{" "}
            </Nav.Link>{" "}
            <Nav.Link as={Link} to="/profile">
              Profile{" "}
            </Nav.Link>{" "}
            <Nav.Link as={Link} to="/children">
              Children{" "}
            </Nav.Link>
            {userLoggedIn ? (
              <Nav.Link onClick={handleLogout} as={Link} to="/">
                Logout
              </Nav.Link>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}
                {location.pathname !== "/register" && (
                  <Nav.Link as={Link} to="/register">
                    Register New Account
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
