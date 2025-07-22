import express from 'express'
import { doctorList, doctorLogin, getDoctorAppointments, updateAppointmentStatus, doctorDashboard, updateDoctorProfile, doctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',doctorLogin)
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments)
doctorRouter.put('/appointments/:appointmentId', authDoctor, updateAppointmentStatus);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile' , authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter