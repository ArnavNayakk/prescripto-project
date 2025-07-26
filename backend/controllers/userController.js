import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from '../models/appointmentModel.js';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';

//Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' });
    }

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    // Update basic fields first
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    // If there's an image, update it separately
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    //Fetch the updated user and return it
    const updatedUser = await userModel.findById(userId);

    res.json({ success: true, message: 'Profile Updated', userData: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//Book Appointment

const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id;

    if (!userId || !docId || !slotDate || !slotTime) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const doctor = await doctorModel.findById(docId).session(session);
    if (!doctor) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (!doctor.available) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Doctor not available' });
    }

    const slots_booked = doctor.slots_booked || {};

    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }

    if (slots_booked[slotDate].includes(slotTime)) {
      await session.abortTransaction();
      return res.status(409).json({ success: false, message: 'Slot already booked' });
    }

    // Mark the slot as booked
    slots_booked[slotDate].push(slotTime);
    doctor.slots_booked = slots_booked;
    await doctor.save({ session });

    const user = await userModel.findById(userId).select('-password').session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const doctorInfo = {
      _id: doctor._id,
      name: doctor.name,
      speciality: doctor.speciality,
      degree: doctor.degree,
      image: doctor.image,
      experience: doctor.experience,
      fees: doctor.fees,
    };

    const appointmentData = {
      userId,
      docId,
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      docData: doctorInfo,
      amount: doctor.fees,
      slotDate,
      slotTime,
      date: new Date(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, message: 'Appointment Booked' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Appointment Booking Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


//List Appointments


const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 })
      .populate("docId"); 

    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      docData: appointment.docId,
    }));

    res.status(200).json({
      success: true,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

//API for cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.userId; 

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment cancelled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    //Creating options for rezorpay
    const options = {
      amount: appointmentData.amount * 100, 
      currency: process.env.CURRENCY || 'INR',
      receipt: appointmentId
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 

//Api to verify razorpay
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);


    const appointmentId = orderInfo.receipt;

    if (appointmentId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
      return res.json({ success: true, message: "Payment marked as complete" });
    } else {
      return res.status(400).json({ success: false, message: "Appointment ID missing in order" });
    }

  } catch (error) {
    console.error(" Razorpay verify error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorPay
};

