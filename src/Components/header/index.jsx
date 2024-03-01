import React from "react";
import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { CiLogout, CiLogin } from "react-icons/ci";
import { FaChild } from "react-icons/fa";
import "./Header.scss";

const Header = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const renderDisplayName = () => {
    if (currentUser && currentUser.displayName) {
      return currentUser.displayName;
    } else if (currentUser && currentUser.email) {
      return currentUser.email;
    } else {
      return "User";
    }
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      // Redirect to login page after successful logout
      window.location.href = "/home";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userLoggedIn = currentUser !== null;

  return (
    <Navbar expand="lg" className="fixed-top navbar" bg="primary">
      <Container>
        <Navbar.Brand className="brand">Allowance App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  {renderDisplayName()}
                </Nav.Link>
                <Nav.Link as={Link} to="/todos">
                  ToDos{" "}
                </Nav.Link>{" "}
                <Nav.Link as={Link} to="/children">
                  Children{" "}
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  as={Link}
                  to="/"
                  className="d-flex align-items-center"
                >
                  <span>Logout</span> <CiLogout className="ml-2" />
                </Nav.Link>
              </>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="d-flex align-items-center"
                  >
                    <span>Login</span> <CiLogin className="ml-2" />
                  </Nav.Link>
                )}
                {location.pathname !== "/register" && (
                  <Nav.Link as={Link} to="/register">
                    Register New Account
                  </Nav.Link>
                )}
              </>
            )}
            {!userLoggedIn && location.pathname !== "/childLogin" && (
              <Nav.Link
                as={Link}
                to="/childLogin"
                className="d-flex align-items-center"
              >
                <span>Child Login</span>
                <FaChild className="ml-2" />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
