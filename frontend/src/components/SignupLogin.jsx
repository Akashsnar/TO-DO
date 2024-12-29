import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupAsync, loginAsync, logout } from '../redux/userSlice';

const SignupLogin = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLogin, loginEmail } = useSelector((state) => state.user);

  const handleSignup = () => {
    dispatch(signupAsync({ email, password }));
  };

  const handleLogin = () => {
    dispatch(loginAsync({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className='w-[400px] mx-auto p-[1rem]'
    >

      <p className='text-3xl font-bold'>Welcome to To-do App</p>
      {isLogin ? (
        <div>
          <h2>Welcome, {loginEmail}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className='pt-5'>

          <input
            className='w-full block  my-[0.5rem] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
      
          <input
          className='w-full bg-transparent block my-[0.5rem]  placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button
            className='bg-blue-700 text-white rounded-md block w-full p-2 my-4'
            onClick={isSignup ? handleSignup : handleLogin}
           
          >
            {isSignup ? 'Sign Up' : 'Log In'} to continue
          </button>
          <p>
            {isSignup ? 'Already have an account?' : 'New user?'}{' '}
            <span
             className="text-blue-500 cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignupLogin;
