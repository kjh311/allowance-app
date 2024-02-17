import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ToDoCrud from "../todos/ToDoCrud.jsx";
import TodoCounter from "../todos/TodoCounter.jsx";


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
            <div className="flex justify-center">
                <TodoCounter />
            </div>
        </div>
    )
}

export default ToDos