import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ChildrenCrud from "../children/ChildrenCrud.jsx";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      

            <br/>
            <br/>
            <br/>

            <div className="flex justify-center">
                Home Page
                <ChildrenCrud />
                </div>
               
               
        </div>
    )
}

export default Home