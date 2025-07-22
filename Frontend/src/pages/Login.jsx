import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Login() {

  const { backendUrl, token, setToken} = useContext(AppContext)
   const navigate = useNavigate()
  const [state, setState] = useState('Sign Up'); 

  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Handle form submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      
       if(state === 'Sign Up'){
          const {data} = await axios.post(backendUrl + '/api/user/register', {name, password, email})
          if(data.success){
            localStorage.setItem('token', data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
       }else{
        const {data} = await axios.post(backendUrl + '/api/user/login', {email, password})
         if(data.success){
          localStorage.setItem('token' , data.token)
          setToken(data.token)
         }else{
          toast.error(data.message)
         }
       }
      
    } catch (error) {
       toast.error(error.message)
    }
  };

  // Reset form on mode switch
  const switchMode = (mode) => {
    setState(mode);
    setName('');
    setEmail('');
    setPassword('');
  };

  useEffect(()=>{
    if(token){
        navigate('/')  
    }
  })

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>Please {state === 'Sign Up' ? 'Create Account' : 'Log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-600 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-600 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-600 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#5f6fff] text-white w-full py-2 rounded-md text-base"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Toggle between login/signup */}
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => switchMode('Login')}
              className="text-[#5f6fff] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => switchMode('Sign Up')}
              className="text-[#5f6fff] underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;
