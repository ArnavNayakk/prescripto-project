import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctor from '../components/RelatedDoctor';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
  } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const formatDateKey = (date) =>
    `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const fetchDocInfo = () => {
    const foundDoctor = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoctor ?? undefined);
  };

  const getAvailableSlots = () => {
    if (!docInfo) return;

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.toDateString() === currentDate.toDateString()) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30, 0, 0);
        const roundedMinutes = now.getMinutes() < 30 ? 30 : 0;
        now.setHours(
          now.getMinutes() < 30 ? now.getHours() : now.getHours() + 1,
          roundedMinutes,
          0,
          0
        );
        currentDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlot = [];
      while (currentDate < endTime) {
        const slotDate = formatDateKey(currentDate);
        const time = formatTime(currentDate);

        const isBooked =
          docInfo.slots_booked?.[slotDate]?.includes(time) ?? false;

        timeSlot.push({
          datetime: new Date(currentDate),
          time,
          isBooked,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlot);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    try {
      setIsLoading(true);
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = formatDateKey(date);

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await getDoctorsData();
        fetchDocInfo();
        navigate('/my-appointment');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Slot already booked. Please choose a different one.");
        await getDoctorsData();
        fetchDocInfo();
        setSlotTime('');
      } else {
        console.error(error);
        toast.error(error.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctors.length && docId) {
      fetchDocInfo();
      setSlotIndex(0);
      setSlotTime('');
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (docInfo === null) return <div>Loading doctor information...</div>;
  if (docInfo === undefined) return <div>Doctor not found.</div>;

  return (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-[#5f6fff] w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
            About
            <img src={assets.info_icon} alt="info" />
          </p>
          <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              ₹
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div
              key={item[0]?.datetime.toISOString() ?? `day-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? "bg-[#5f6fff] text-white"
                  : "border border-gray-200"
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((item) => (
            <p
              key={item.datetime.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => !item.isBooked && setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.isBooked
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : item.time === slotTime
                  ? 'bg-[#5f6fff] text-white'
                  : 'text-gray-400 border border-gray-300'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button
          onClick={bookAppointment}
          disabled={!slotTime || isLoading}
          className={`bg-[#5f6fff] text-white text-sm font-light px-14 py-3 rounded-full my-6 ${
            (!slotTime || isLoading) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;

