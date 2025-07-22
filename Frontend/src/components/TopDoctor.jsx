import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

function TopDoctor() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-5 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors?.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (!item.available) {
                toast.error('Doctor is not available right now');
                return;
              }
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className={`border rounded-xl overflow-hidden transition-all duration-500 ${
              item.available
                ? 'border-blue-200 cursor-pointer hover:-translate-y-2 bg-white'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed'
            }`}
          >
            <img
              className={`w-full h-auto sm:h-48 object-contain sm:object-cover ${
                item.available ? 'bg-blue-50' : 'bg-gray-200 opacity-70'
              }`}
              src={item.image}
              alt={item.name}
            />
            <div className={`p-4 flex items-center gap-2 text-sm ${
              item.available ? 'text-green-500' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                item.available ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <p>{item.available ? 'Available' : 'Not available'}</p>
            </div>
            <div className="px-4 pb-4">
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className="bg-blue-50 cursor-pointer text-gray-600 hover:bg-blue-100 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  );
}

export default TopDoctor;
