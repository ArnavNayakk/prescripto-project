import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

function Navbar() {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }

    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }

    navigate('/')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img src={assets.admin_logo} alt="Admin Logo" className='w-36 sm:w-40 cursor-pointer' />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'Admin' : dToken ? 'Doctor' : 'User'}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-[#5f6fff] text-white text-sm px-10 py-2 rounded-full hover:bg-[#4e5ae5] transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
