import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

function DoctorsList() {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div
        className="
          w-full
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          pt-5
        "
      >
        {doctors.map((item, index) => (
          <div
            className="
              border border-indigo-200 rounded-xl
              overflow-hidden cursor-pointer group
              shadow bg-white flex flex-col hover:shadow-lg transition-shadow
            "
            key={index}
          >
            <div className="w-full aspect-[4/3] bg-indigo-50 group-hover:bg-[#5f6fff] transition-colors duration-500 flex items-center justify-center">
              <img
                className="object-contain w-full h-full"
                src={item.image}
                alt={`Dr. ${item.name}`}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  className="accent-indigo-500"
                />
                <span>Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList

