import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { FaBars } from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className='flex flex-row justify-between items-center w-full z-20 fixed top-0 left-0 h-12 border-b bg-blue-500 text-white'>
            <div className="text-sm ml-4">Allowance App</div>
            <div className="text-sm">
                {userLoggedIn && (
                    <span>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}</span>
                )}
            </div>
            <div className="flex items-center mr-4">
                {userLoggedIn && (
                    <button onClick={toggleDropdown} className='text-sm focus:outline-none lg:hidden'>
                        <FaBars />
                    </button>
                )}
                {isDropdownOpen && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-lg rounded-md p-2">
                        <Link to='/profile' onClick={closeDropdown} className='block text-sm py-1 px-2 hover:bg-gray-100 text-black'>Profile</Link>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }); closeDropdown(); }} className='block text-sm py-1 px-2 hover:bg-gray-100 text-black'>Logout</button>
                    </div>
                )}
                {userLoggedIn && (
                    <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm underline lg:inline-block hidden'>Logout</button>
                )}
                {!userLoggedIn && (
                    <>
                        <Link className='text-sm underline' to={'/login'}>Login</Link>
                        <Link className='text-sm underline' to={'/register'}>Register New Account</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
