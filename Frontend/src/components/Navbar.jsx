import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/')
  };

  const openMenu = () => {
    setShowMenu(true);
    setTimeout(() => setAnimateMenu(true), 10);
    
  };

  const closeMenu = () => {
    setAnimateMenu(false);
    setTimeout(() => setShowMenu(false), 300);
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 relative">
      <img
        onClick={() => navigate('/')}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] py-1' : 'py-1')}>
          <li>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] py-1' : 'py-1')}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] py-1' : 'py-1')}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] py-1' : 'py-1')}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <div className="relative group cursor-pointer hidden md:block">
            <div className="flex items-center gap-2">
              <img className="w-9 h-9 object-cover rounded-full" src={userData.image || assets.default_profile} alt="Profile" />
              <img className="w-3 transition-transform duration-300 group-hover:rotate-180" src={assets.dropdown_icon} alt="Dropdown" />
            </div>
            <div className="absolute top-full right-0 mt-2 pt-4 text-base font-medium text-gray-600 z-20 bg-stone-100 rounded flex-col gap-4 p-4 min-w-48 opacity-0 group-hover:opacity-100 hidden group-hover:flex transition-all duration-300 ease-in-out">
              <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
              <p onClick={() => navigate('/my-appointment')} className="hover:text-black cursor-pointer">My Appointment</p>
              <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#5f6fff] text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}

        
        <img onClick={openMenu} className="w-6 md:hidden" src={assets.menu_icon} alt="Menu" />

        {token && userData && (
          <div className="relative md:hidden">
            <img
              className="w-9 h-9 object-cover rounded-full cursor-pointer"
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              src={userData.image || assets.default_profile}
              alt="Profile"
            />
            {showMobileDropdown && (
              <div className="absolute top-full right-0 mt-2 pt-4 text-base font-medium text-gray-600 z-50 bg-stone-100 rounded flex-col gap-4 p-4 min-w-48 shadow-lg">
                <p onClick={() => { navigate('/my-profile'); setShowMobileDropdown(false); }} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={() => { navigate('/my-appointment'); setShowMobileDropdown(false); }} className="hover:text-black cursor-pointer">My Appointment</p>
                <p onClick={() => { logout(); setShowMobileDropdown(false); }} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            )}
          </div>
        )}

        {!token && (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#5f6fff] text-white px-4 py-2 rounded-full font-light block md:hidden"
          >
            Create account
          </button>
        )}

       
        {showMenu && (
          <>
            <div
              onClick={closeMenu}
              className={`fixed inset-0 z-30 bg-black transition-opacity duration-300 ${animateMenu ? 'opacity-40' : 'opacity-0'}`}
            />

            
            <div
              className={`fixed top-0 right-0 w-4/5 h-full bg-white z-40 transition-transform duration-300 ease-in-out ${animateMenu ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="flex items-center justify-between px-5 py-6">
                <img className="w-36" src={assets.logo} alt="Logo" />
                <img className="w-7 cursor-pointer" onClick={closeMenu} src={assets.cross_icon} alt="Close" />
              </div>
              <ul className="flex flex-col items-center gap-2 mt-5 text-lg font-medium">
                <NavLink onClick={closeMenu} to="/" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] px-4 py-2' : 'px-4 py-2')}>
                  <p>HOME</p>
                </NavLink>
                <NavLink onClick={closeMenu} to="/doctors" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] px-4 py-2' : 'px-4 py-2')}>
                  <p>ALL DOCTORS</p>
                </NavLink>
                <NavLink onClick={closeMenu} to="/about" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] px-4 py-2' : 'px-4 py-2')}>
                  <p>ABOUT</p>
                </NavLink>
                <NavLink onClick={closeMenu} to="/contact" className={({ isActive }) => (isActive ? 'border-b-2 border-[#5f6fff] px-4 py-2' : 'px-4 py-2')}>
                  <p>CONTACT</p>
                </NavLink>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
