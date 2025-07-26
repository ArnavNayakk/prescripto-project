import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import { assets } from '../../assets/assets';

function DoctorAppointment() {
  const { dToken, getAppointments, appointments, updateAppointmentStatus } = useContext(DoctorContext);
  const { calculateAge, slotDataFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointment</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patients</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userId?.image || assets.default_user_icon}
                alt="User"
              />
              <p>{item.userId?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs inline border border-blue-400 px-2 rounded-full">
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userId.dob)}</p>
            <p>
              {slotDataFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p> ₹{item.amount}</p>

            <div className="flex items-center justify-center">
              {item.cancelled ? (
                <p className="text-sm text-red-600 font-medium flex-1">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-sm text-green-600 font-medium flex-1">Completed</p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <img
                    onClick={() => updateAppointmentStatus(item._id, 'cancel')}
                    className="w-10 cursor-pointer flex-1"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    title="Cancel"
                  />
                  <img
                    onClick={() => updateAppointmentStatus(item._id, 'complete')}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                    title="Mark as Complete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointment;

