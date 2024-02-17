import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ToDoCrud from "../todos/ToDoCrud.jsx";


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
        </div>
    )
}

export default ToDos