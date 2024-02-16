import React from 'react'
import { useAuth } from '../../contexts/authContext'
// import ColorCrud from "../ColorCrud.js";
import ToDoCrud from "../ToDoCrud.jsx";
import ChildrenCrud from "../ChildrenCrud.jsx";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
           {/* <div className='text-2xl font-bold pt-14 flex justify-center'>
                <h1>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</h1>
            </div> */}

            <br/>
            <br/>
            <br/>

            <div className="flex justify-center">
                <ChildrenCrud />
                </div>
                <hr></hr>
                <br/>
                <div className="flex justify-center">
                <ToDoCrud />
            </div>
        </div>
    )
}

export default Home