import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import { assets } from '../../assets/assets';

function AllAppointment() {
  const { aToken, getAllAppointments, appointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDataFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="text-xl font-semibold mb-3">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData?.image || assets.default_user_icon}
                alt={item.userData?.name || 'Patient'}
              />
              <p>{item.userData?.name || 'Unknown'}</p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData?.dob) || 'N/A'}</p>

            <p>{slotDataFormat(item.slotDate)}, {item.slotTime}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-contain"
                src={item.docId?.image || assets.default_doctor_icon}
                alt={item.docId?.name || 'Doctor'}
              />
              <p>{item.docId?.name || 'Unknown'}</p>
            </div>

            <p>₹{item.amount}</p>

            
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted
            ? <p className='text-green-500 text-xs font-medium'>Completed</p>
            :
             (
              <img
                onClick={() => cancelAppointment(item._id)}
                src={assets.cancel_icon}
                className="w-10 cursor-pointer"
                alt="Cancel"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAppointment;
