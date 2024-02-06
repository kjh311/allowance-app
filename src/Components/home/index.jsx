import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ColorCrud from "../ColorCrud.js";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
        
        <ColorCrud />
        </div>
    )
}

export default Home