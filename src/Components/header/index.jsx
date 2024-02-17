import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await doSignOut();
            // Redirect to login page after successful logout
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top">
            <Navbar.Brand as={Link} to="/home">Allowance App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/todos">ToDos</Nav.Link>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/children">Children</Nav.Link>
                </Nav>
                <Nav className="ml-auto align-items-center justify-content-end"> {/* Update this line */}
                    {userLoggedIn && currentUser && (
                        <>
                            <span className="mr-2">{currentUser.displayName ? currentUser.displayName : currentUser.email}</span>
                            {currentUser.photoURL && (
                                <img src={currentUser.photoURL} alt="User Profile" className="rounded-circle" style={{ width: '32px', height: '32px' }} />
                            )}
                        </>
                    )}
                    {userLoggedIn ? (
                        <Button variant="light" onClick={handleLogout} className="ml-3">Logout</Button>
                    ) : (
                        <>
                            {location.pathname !== '/login' && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
                            {location.pathname !== '/register' && <Nav.Link as={Link} to="/register">Register New Account</Nav.Link>}
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
