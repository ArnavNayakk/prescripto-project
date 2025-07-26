import React, { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = '$'
const backendUrl = import.meta.env.VITE_BACKEND_URL
const [doctors, setDoctors] = useState([])
const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') :false)
const [userData, setUserData] = useState(false)

const getDoctorsData = async() =>{
    
  try {
    
       const {data} = await axios.get(backendUrl + '/api/doctor/list')
         if(data.success){
             setDoctors(data.doctors)
         }else{
          toast.error(error.message)
         }

  } catch (error) {
     console.log(error)
     toast.error(error.message)
  }
}

const loadUserProfileData = async () => {
  try {
    if (!token) return; 

    const response = await axios.get(backendUrl + '/api/user/get-profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    if (response?.data?.success) {
      setUserData(response.data.userData);
      return response.data.userData; 
    } else {
      toast.error(response?.data?.message || 'Failed to load user profile');
    }

  } catch (error) {
    console.error('Profile Load Error:', error.message);

    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      setToken(null);
      setUserData(false);

      toast.error('Session expired. Please login again.');
      navigate('/login'); 
    } else {
      toast.error(error?.response?.data?.message || 'Unauthorized or server error');
    }
  }
};

const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDataFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0]+" " + months[Number(dateArray[1])] + " " + dateArray[2]
    }



useEffect(()=>{
   getDoctorsData()
},[])

useEffect(()=>{
  if(token){
    loadUserProfileData()
  }else{
    setUserData(false)
  }
},[token])

  const value = {
    doctors, getDoctorsData,
    currencySymbol,
    token, setToken, 
    setDoctors,
    backendUrl, userData,
    setUserData, loadUserProfileData,
    slotDataFormat

  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider; 
