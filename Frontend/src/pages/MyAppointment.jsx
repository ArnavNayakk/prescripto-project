import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader'; // ✅ Import your Loader component

function MyAppointment() {
  const { backendUrl, token, slotDataFormat, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const navigate = useNavigate();

  const getUserAppointment = async () => {
    setLoading(true); // ✅ Start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const sortedAppointments = data.appointments.sort(
          (a, b) => new Date(b.slotDate) - new Date(a.slotDate)
        );
        setAppointments(sortedAppointments);
      } else {
        toast.error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false); // ✅ Stop loading
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while canceling the appointment.");
      console.error(error);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (data.success) {
            getUserAppointment();
            navigate('/my-appointment');
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-center mb-5">My Appointments</h1>
      <hr className="mb-10" />

      {loading ? (
        <Loader /> // ✅ Show loader while loading
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No appointments found.</p>
      ) : (
        <div className="space-y-8">
          {appointments.map((item, index) => {
            if (!item.docData) return null;

            const doctorImage = item.docData.image?.startsWith("http")
              ? item.docData.image
              : `${backendUrl}${item.docData.image}`;

            return (
              <div
                key={item._id || index}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:items-center md:gap-6 p-8 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <img
                  className="w-36 h-36 object-contain rounded-md bg-indigo-100 p-1 mx-auto md:mx-0"
                  src={doctorImage || '/default-doctor.png'}
                  alt={item.docData?.name || 'Doctor'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-doctor.png';
                  }}
                />

                <div className="flex-1 mt-4 md:mt-0 text-gray-700 space-y-2">
                  <h2 className="text-xl font-semibold text-[#5f6fff]">{item.docData?.name}</h2>
                  <p className="text-sm capitalize">{item.docData?.speciality || 'Speciality not specified'}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Address:</p>
                    <p className="text-sm text-gray-600">{item.docData?.address?.line1 || 'N/A'}</p>
                    {item.docData?.address?.line2 && (
                      <p className="text-sm text-gray-600">{item.docData.address.line2}</p>
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">Date & Time:</span> {slotDataFormat(item.slotDate)} || {item.slotTime}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">Amount:</span> ₹{item.amount}
                  </p>
                </div>

                <div className="mt-6 md:mt-0 md:ml-auto pr-4 flex flex-col gap-3 w-full md:w-44">
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="w-full h-10 rounded cursor-pointer bg-[#5f6fff] text-white hover:bg-indigo-600 transition text-sm"
                    >
                      Pay Online
                    </button>
                  )}

                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="w-full h-10 rounded cursor-pointer bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  )}

                  {item.cancelled && !item.isCompleted && (
                    <button className="w-full h-10 border border-red-500 text-red-500 rounded text-sm">
                      Cancelled
                    </button>
                  )}

                  {!item.cancelled && item.payment && (
                    <button className="w-full h-10 border text-stone-500 bg-indigo-50 rounded text-sm">
                      Paid
                    </button>
                  )}

                  {item.isCompleted && (
                    <button className="w-full h-10 border border-green-500 rounded text-green-500 text-sm">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAppointment;
