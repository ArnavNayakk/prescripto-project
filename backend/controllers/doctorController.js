import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailablity = async (req, res) => {
    try {
        
          const {docId} = req.body

          const docData = await doctorModel.findById(docId)
           await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
           res.json({success:true, message:'Availabilty Changed'})
    } catch (error) {
           console.log(error)
        res.json({success:false, message:error})
    }
}
 
const doctorList = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

         res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error})
    }
}

//API for doctor login
const doctorLogin = async(req,res) => {

    try {
        
      const { email, password } = req.body
      const doctor = await doctorModel.findOne({email})
      
      if(!doctor){
        return res.json({success:false, message:'Invalid credentials'})

      }
       const isMatch = await bcrypt.compare(password, doctor.password)

       if(isMatch){

        const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
        res.json({success:true,token})

       }else{
        res.json({success:false, message:'Invalid credentails'})
       }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error})  
    }
}

//API to get doctor appointments for doctor panel
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.docId; 

    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID not found' });
    }

    const appointments = await appointmentModel.find({ docId: doctorId })
      .populate('userId', 'name image dob') 
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


//Api to cancel and complelet appointment
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { action } = req.body; 

  if (!['cancel', 'complete'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  try {
    const update = {};
    if (action === 'cancel') update.cancelled = true;
    if (action === 'complete') update.isCompleted = true;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      update,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, appointment: updatedAppointment });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

//api to get  dashboard for doctor panel

const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.docId; 

    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID not found' });
    }

    const appointments = await appointmentModel
      .find({ docId: doctorId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email image'); 

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach(item => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount || 0;
      }
      patientSet.add(item.userId?._id?.toString());
    });

    const latestAppointments = appointments.slice(0, 5).map(item => ({
      ...item._doc,
      userData: item.userId 
    }));

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.error('Error getting dashData:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

 
//Api for doctor profile for doctor pannel
const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.docId; 

    const doctor = await doctorModel.findById(doctorId).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//Api to update doctor profile
const updateDoctorProfile = async(req,res)=>{
  
   try {
    
     const {fees, address, available} = req.body
     const docId = req.docId;

     await doctorModel.findByIdAndUpdate(docId, {fees, address, available})
      res.json({success:true, message:'Profile Updated'})

   } catch (error) {
     console.error('Error to update', error);
      res.status(500).json({ success: false, message: 'Server Error' });
   }

}


export {changeAvailablity, doctorList, doctorLogin, getDoctorAppointments, updateAppointmentStatus, doctorDashboard, doctorProfile, updateDoctorProfile}