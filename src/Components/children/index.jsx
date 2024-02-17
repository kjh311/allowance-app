import React from 'react'
import { useAuth } from '../../contexts/authContext'
import ChildrenCrud from "../children/ChildrenCrud.jsx";


const Children = () => {
    const { currentUser } = useAuth()
    return (
        <div>
      
Children
            <br/>
            <br/>
          
                <br/>
                <div className="flex justify-center">
                <ChildrenCrud />
            </div>
        </div>
    )
}

export default Children