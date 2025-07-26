import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

function SideBar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-white border-r w-16 md:w-60 lg:w-72 shrink-0">
      {(aToken || dToken) && (
        <ul className="text-[#515151] mt-5 space-y-1">
          {aToken && (
            <>
              <SidebarLink to="/admin-dashboard" icon={assets.home_icon} label="Dashboard" />
              <SidebarLink to="/all-appointment" icon={assets.appointment_icon} label="Appointment" />
              <SidebarLink to="/add-doctor" icon={assets.add_icon} label="Add Doctor" />
              <SidebarLink to="/doctor-list" icon={assets.people_icon} label="Doctor List" />
            </>
          )}

          {dToken && (
            <>
              <SidebarLink to="/doctor-dashboard" icon={assets.home_icon} label="Dashboard" />
              <SidebarLink to="/doctor-appointment" icon={assets.appointment_icon} label="Appointment" />
              <SidebarLink to="/doctor-profile" icon={assets.people_icon} label="Profile" />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-6 cursor-pointer transition-colors ${
          isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6fff]' : ''
        }`
      }
    >
      <img src={icon} className="w-6 h-6 flex-shrink-0" />
      <p className="hidden md:block">{label}</p>
    </NavLink>
  );
}

export default SideBar;


