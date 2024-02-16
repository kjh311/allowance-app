import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ToDoCrud from "../todos/ToDoCrud.jsx";
import StickyFooter from '../footer/StickyFooter';

const ToDos = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      

            <br/>
            <br/>
          
                <br/>
                <div className="flex justify-center">
                <ToDoCrud />
            </div>
            <StickyFooter />
        </div>
    )
}

export default ToDos