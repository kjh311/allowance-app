import React from 'react';
import { useAuth } from '../../contexts/authContext';
import ChildCreation from "../children/ChildCreation.jsx";
import TodoCounter from "../todos/TodoCounter.jsx";

const UserProfile = () => {
    const { currentUser } = useAuth();

    return (
        <div className="h-screen flex flex-col items-center justify-center"style={{
            marginTop: '30px',
        }}>
            <div className="w-96 px-6 py-6 text-center bg-gray-800 rounded-lg lg:mt-0 xl:px-10">
                <div className="space-y-4 xl:space-y-6">
                    <img className="mx-auto rounded-full h-36 w-36" src={currentUser.photoURL} alt="author avatar" />
                    <div className="space-y-2">
                        <div className="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
                            <h3 className="text-white">{currentUser.displayName}</h3>
                            <p className="text-indigo-300">Web Developer</p>
                            <div className="flex justify-center mt-5 space-x-5">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400">
                                    <span className="sr-only">Twitter</span>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-6 h-6 text-gray-400 hover:text-gray-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        {/* Twitter icon */}
                                    </svg>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400">
                                    <span className="sr-only">GitHub</span>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" className="w-6 h-6 text-gray-400 hover:text-gray-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        {/* GitHub icon */}
                                    </svg>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400">
                                    <span className="sr-only">Linkedin</span>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-6 h-6 text-gray-400 hover:text-gray-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        {/* LinkedIn icon */}
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChildCreation />
            <TodoCounter />

        </div>
    );
};

export default UserProfile;
