import React from 'react';
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
        <nav className='flex flex-row justify-between items-center w-full z-20 fixed top-0 left-0 h-12 border-b bg-blue-500 text-white'>
            <Link to="/home" className="text-sm ml-4 hover:underline">Allowance App</Link>
            <div className="text-sm flex items-center">
                {userLoggedIn && currentUser && ( // Check if user is logged in and currentUser exists
                    <>
                        <span>{currentUser.displayName ? currentUser.displayName : currentUser.email}</span>
                        {currentUser.photoURL && (
                            <img src={currentUser.photoURL} alt="User Profile" className="w-6 h-6 rounded-full ml-2" />
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center mr-4">
                <Link to='/todos' className='text-sm hover:underline ml-4'>ToDos</Link>
                <Link to='/profile' className='text-sm hover:underline ml-4'>Profile</Link>
                <Link to='/children' className='text-sm hover:underline ml-4'>Children</Link>
                {userLoggedIn ? (
                    <button onClick={handleLogout} className='text-sm underline ml-4'>Logout</button>
                ) : (
                    <>
                        {location.pathname !== '/login' && <Link className='text-sm underline ml-4' to={'/login'}>Login</Link>}
                        {location.pathname !== '/register' && <Link className='text-sm underline ml-4' to={'/register'}>Register New Account</Link>}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
