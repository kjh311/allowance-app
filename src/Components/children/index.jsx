import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ChildrenCrud from "../children/ChildrenCrud.jsx";
import ChildCreation from "../children/ChildCreation.jsx";
import ChildViewing from "../children/ChildViewing.jsx";


const Children = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      
Children
            <br/>
            <br/>
          
                <br/>
                <div className="flex justify-center">
                <ChildCreation />
            </div>
            <div className="flex justify-center">
                <ChildViewing />
            </div>
        </div>
    )
}

export default Children