import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ToDoCrud from "../todos/ToDoCrud.jsx";
import TodoCreation from "../todos/TodoCreation.jsx";
import TodoViewing from "../todos/TodoViewing.jsx";
import TodoCounter from "../todos/TodoCounter.jsx";


const ToDos = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      

            <br/>
            <br/>
          
                <br/>
                <div className="flex justify-center">
                <TodoCreation />
            </div>
            <div className="flex justify-center">
                <TodoViewing />
            </div>
            {/* <div className="flex justify-center">
                <TodoCounter />
            </div> */}
            <br/>
            <br/>
        </div>
    )
}

export default ToDos