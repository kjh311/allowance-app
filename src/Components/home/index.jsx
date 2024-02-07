import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ColorCrud from "../ColorCrud.js";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
            <div className='text-2xl font-bold pt-14'>
                <h1>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</h1>
            </div>
            <br/>
            <ColorCrud />
        </div>
    )
}

export default Home
