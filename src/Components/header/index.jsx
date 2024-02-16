import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
    const { currentUser, userLoggedIn } = useAuth();

    return (
        <nav className='flex flex-row justify-between items-center w-full z-20 fixed top-0 left-0 h-12 border-b bg-blue-500 text-white'>
            <Link to="/home" className="text-sm ml-4 hover:underline">Allowance App</Link>
            <div className="text-sm flex items-center">
                {userLoggedIn && (
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
                {userLoggedIn ? (
                    <button onClick={() => doSignOut()} className='text-sm underline ml-4'>Logout</button>
                ) : (
                    <>
                        <Link className='text-sm underline ml-4' to={'/login'}>Login</Link>
                        <Link className='text-sm underline ml-4' to={'/register'}>Register New Account</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
