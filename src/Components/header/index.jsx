import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-blue-500'>
            {/* Change bg-gray-200 to bg-blue-500 or any other color class */}
            {
                userLoggedIn
                    ?
                    <>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-white underline'>Logout</button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-white underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-white underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header
