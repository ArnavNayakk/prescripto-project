import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader'; 

function Doctor() {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyFilter = () => {
    setLoading(true);
    setTimeout(() => {
      if (speciality) {
        setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
      } else {
        setFilterDoc(doctors);
      }
      setLoading(false);
    }, 500); 
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="md:mx-10 my-10">
      <p className="text-gray-600 mb-5">Browse through the doctors specialist.</p>
      <button
        className={`py-1 px-3 border rounded mb-2.5 text-sm transition-all sm:hidden ${
          showFilter ? 'bg-[#5f6fff] text-white' : ''
        }`}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        filter
      </button>

      <div className="flex flex-col sm:flex-row gap-5">
        <div
          className={`flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist',
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate('/doctors')
                  : navigate(`/doctors/${spec}`)
              }
              className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer transition-all ${
                speciality === spec ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center min-h-[40vh]">
              <Loader />
            </div>
           ) : (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (!item.available) {
                    toast.error('Doctor is not available right now');
                    return;
                  }
                  navigate(`/appointment/${item._id}`);
                }}
                className={`border rounded-xl overflow-hidden transition-all duration-500 ${
                  item.available
                    ? 'border-blue-200 cursor-pointer hover:-translate-y-2 bg-white'
                    : 'bg-gray-100 border-gray-300 cursor-not-allowed'
                }`}
              >
                <img
                  className={`w-full max-w-xl aspect-[4/3] object-contain rounded-md mx-auto ${
                    item.available ? 'bg-blue-50' : 'bg-gray-200 opacity-70'
                  }`}
                  src={item.image}
                  alt={item.name}
                />
                <div
                  className={`p-4 flex items-center gap-2 text-sm ${
                    item.available ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></div>
                  <p>{item.available ? 'Available' : 'Not available'}</p>
                </div>
                <div className="px-4 pb-4">
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctor;

