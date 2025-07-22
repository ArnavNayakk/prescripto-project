import { createContext, useState } from "react";
import axios  from 'axios'
import{toast} from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const[dToken, setDToken] = useState(localStorage.getItem('dToken') || '');

    const[appointments, setAppointments]= useState([])

   const [dashData, setDashData] = useState(false)

   const [profileData, setProfileData] = useState(false)

  const getAppointments = async () => {
    try {
      const res = await axios.get( backendUrl + '/api/doctor/appointments', {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  //cancel or complete appointment
  const updateAppointmentStatus = async (appointmentId, action) => {
  try {
   const res = await axios.put(
  `${backendUrl}/api/doctor/appointments/${appointmentId}`,
  { action },
  {
    headers: {
      Authorization: `Bearer ${dToken}`,
    },
  }
);


    if (res.data.success) {
        toast.success("Appointment updated");

      getAppointments();
    }else {
  toast.error("Failed to update appointment");
   }  
  } catch (err) {
    console.error("Failed to update appointment:", err);
  }
};


const getDashData = async () => {
  try {
    const res = await axios.get(
      `${backendUrl}/api/doctor/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      }
    );

    if (res.data.success) {
      setDashData(res.data.dashData);
      console.log('Dashboard Data:', res.data.dashData);
    } else {
      toast.error(res.data.message || 'Failed to fetch dashboard');
    }
  } catch (error) {
    console.error("Failed to get dashData:", error);
    toast.error("Something went wrong while fetching dashboard");
  }
};

//api to get profile
const getProfileData = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/doctor/profile`, {
      headers: {
        Authorization: `Bearer ${dToken}`,
      },
    });

    if (res.status === 200) {
      setProfileData(res.data);
      console.log(res.data)
    } else {
      toast.error("Failed to fetch profile data");
    }
  } catch (error) {
    console.error("Failed to get profile:", error);
    toast.error("Something went wrong while fetching profile");
  }
};







    const value = {
       dToken, setDToken,
       backendUrl, appointments,
       setAppointments, getAppointments,
       updateAppointmentStatus,getDashData, 
       dashData, setDashData,
       profileData, setProfileData,
       getProfileData

    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider