import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate()
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid [grid-template-columns:3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ------- Left section ------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="Prescripto logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
           This website makes it easy to book doctor appointments from the comfort of your home.
           You can view doctor details, check available time slots, and book instantly.
           It’s a simple, fast, and reliable way to manage your healthcare needs.
          </p>
        </div>

        {/* ------- Center section ------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className='hover:text-[#5f6fff] cursor-pointer' onClick={()=>{navigate('/');window.scrollTo(0, 0)}}>Home</li>
            <li className='hover:text-[#5f6fff] cursor-pointer' onClick={()=>{navigate('/about');window.scrollTo(0, 0)}}>About us</li>
            <li className='hover:text-[#5f6fff] cursor-pointer' onClick={()=>{navigate('/contact');window.scrollTo(0, 0)}}>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* ------- Right section ------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 974X-XXXX-97</li>
            <li className='text-[#5f6fff]'>prescripto@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2024 Prescripto — All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;
