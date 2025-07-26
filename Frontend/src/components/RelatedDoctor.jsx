import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function RelatedDoctor({ speciality, docId }) {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDocs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-5 pt-5 gap-y-6 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
          >
            <img
              className={`w-full max-w-xl aspect-[4/3] object-contain rounded-md mx-auto bg-blue-50`}
              src={item.image}
              alt={item.name}
              onError={(e) => (e.target.src = '/default-avatar.png')}
            />
            <div className="p-4 flex items-center gap-2 text-sm text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p>Available</p>
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
        className="bg-blue-50 hover:bg-blue-100 cursor-pointer text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  );
}

export default RelatedDoctor;
