import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { Link } from 'react-router-dom';



const Navbar = () => {
    const dispatch = useDispatch();
    const { isLogin, loginEmail } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div>
            <header className="w-full bg-gray-200 py-4 shadow-sm">
                <nav className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard"
                            className="text-gray-800 font-semibold hover:text-blue-500"
                        >
                            Dashboard
                        </Link>
                          <Link
                            to="/tasks"
                            className="text-gray-800 font-semibold hover:text-blue-500"
                        >
                            Task list
                        </Link>
                    </div>
                    {isLogin ? <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleLogout}>
                        Sign out
                    </button> : <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Login
                    </button>}
                </nav>
            </header>

        </div>
    )
}

export default Navbar
