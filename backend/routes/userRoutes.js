import express from 'express';
import upload from '../middleware/multer.js';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, getUserAppointments, cancelAppointment, paymentRazorpay, verifyRazorPay } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';

const UserRouter = express.Router();

// Auth routes
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);

// Profile routes
UserRouter.get('/get-profile', authUser, getProfile); 
UserRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
UserRouter.post('/book-appointment', authUser, bookAppointment);
UserRouter.get('/appointments', authUser ,getUserAppointments);
UserRouter.post('/cancel-appointment', authUser ,cancelAppointment);
UserRouter.post('/payment-razorpay', authUser,paymentRazorpay)
UserRouter.post('/verifyRazorpay', authUser, verifyRazorPay)
export default UserRouter;
