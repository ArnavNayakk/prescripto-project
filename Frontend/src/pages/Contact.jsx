import React from 'react'
import { assets } from '../assets/assets'

function Contact() {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-8 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt=''/>
        <div className='flex flex-col justify-centre items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>A-1-116, Sushant Lok-1<br/>
            Gurgaon, Haryana-122009, India
          </p>
          <p className='text-gray-500'>Tel: (867) 555-9760<br/>Email: BookingDoc@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact