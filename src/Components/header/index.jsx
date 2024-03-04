import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { CiLogout, CiLogin } from "react-icons/ci";
import { FaChild } from "react-icons/fa";
import "./Header.scss";

const Header = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // const [activeLink, setActiveLink] = useState(location.pathname);
  // console.log(activeLink);

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
        <Navbar.Brand className="brand">
          {/* <img src="../../../public/images/money-icon.png" /> */}
          Allowance App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav className="ms-auto">
            {userLoggedIn ? (
              <>
                <Nav.Link className="link" as={NavLink} to="/profile">
                  {renderDisplayName()}
                </Nav.Link>
                <Nav.Link className="link" as={NavLink} to="/todos">
                  ToDos
                </Nav.Link>
                <Nav.Link className="link" as={NavLink} to="/children">
                  Children
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  className="d-flex align-items-center link"
                >
                  <span>Logout</span> <CiLogout className="ml-2" />
                </Nav.Link>
              </>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    className="d-flex align-items-center link"
                  >
                    <span>Login</span> <CiLogin className="ml-2" />
                  </Nav.Link>
                )}
                {!userLoggedIn && location.pathname !== "/childLogin" && (
                  <Nav.Link
                    as={NavLink}
                    to="/childLogin"
                    className="d-flex align-items-center link"
                  >
                    <span>Child Login</span>
                    <FaChild className="ml-2" />
                  </Nav.Link>
                )}
                {location.pathname !== "/register" && (
                  <Nav.Link className="link" as={NavLink} to="/register">
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
