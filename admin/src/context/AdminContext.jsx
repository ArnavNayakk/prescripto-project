import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]) 
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {

    try {
       
          const {data} = await axios.post(backendUrl + '/api/admin/all-doctors' , {}, {headers:{aToken}})
          if (data.success){
            setDoctors(data.doctors)
            console.log(data.doctors)
          }else{
            toast.error(data.message)
          }

    } catch (error) {
       toast.error(error.message)
    }
  }


  useEffect(() => {
    if (aToken) {
      localStorage.setItem('aToken', aToken);
    } else {
      localStorage.removeItem('aToken');
    }
  }, [aToken]);

  const changeAvailability = async (docId) => {
    
    try {
      
const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers:{aToken}})


if(data.success){
   toast.success(data.message)
   getAllDoctors()
}else{
  toast.error(data.message)
}

    } catch (error) {
      console.log(error);
    }
  }

  //Api get all appointment

  const getAllAppointments = async () => {
  try {
  const { data } = await axios.get(backendUrl + '/api/admin/appointments', {headers: {aToken}});


    if (data.success) {
      setAppointments(data.appointments);
      console.log(data.appointments);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.error(error);
  }
};

//api to cancel appointment
const cancelAppointment = async(appointmentId) =>{
 
   try {
    
    const { data } = await axios.post(backendUrl+'/api/admin/cancel-appointment', {appointmentId}, {headers: {aToken}})

    if(data.success){
      toast.success(data.message)
      getAllAppointments()
    }else{
      toast.error(data.message)
    }

   } catch (error) {
     toast.error(error.message)
   }
     
}

//api to get dashdata
const getDashData = async() => {

  try {
    const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {headers:{aToken}})

  if(data.success){
     setDashData(data.data)
     console.log(data.data)
  }else{
    toast.error(data.message)
  }
  } catch (error) {
     toast.error(error.message)
  }

}


  const value = {
    aToken,
    setAToken,
    backendUrl,doctors,
    getAllDoctors, changeAvailability,
    appointments, setAppointments,
    getAllAppointments, cancelAppointment,
    dashData,getDashData 
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
