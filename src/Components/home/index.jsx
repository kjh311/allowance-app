import React from 'react'
import { useAuth } from '../../contexts/authContext'
// import ColorCrud from "../ColorCrud.js";
import ToDoCrud from "../todos/ToDoCrud.jsx";
import ChildrenCrud from "../ChildrenCrud.jsx";
import StickyFooter from '../footer/StickyFooter';

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      

            <br/>
            <br/>
            <br/>

            <div className="flex justify-center">
                Home Page
                </div>
               
               
            <StickyFooter />
        </div>
    )
}

export default Home