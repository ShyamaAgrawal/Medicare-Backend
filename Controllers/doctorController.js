const Booking = require('../models/Booking.js');
const Doctor = require('../models/Doctor.js');

exports.getDoctorDetails = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const doctorDetails = await Doctor.findById(id).populate('reviews').select("-password");
        if (!doctorDetails) {
            return res.status(200).json({ success: true, message: "Doctor not found" });
        }
        res.status(200).json({ success: true, message: "Doctor details fetched successfully", data: doctorDetails });
    } catch (error) {
        console.log('Error fetching doctor details:', error)
        res.status(500).json({ success: false, message: "Failed to fetch doctor details" })
    }
}

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedDoctor) {
            return res.status(200).json({ success: true, message: "Doctor not found" });
        }
        res.status(200).json({ success: true, message: "Details updated successfully", data: updatedDoctor });
    } catch (error) {
        console.log('Error updating doctor details:', error)
        res.status(500).json({ success: false, message: "Failed to update doctor details" })
    }
}

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(200).json({ success: true, message: "Doctor not found" });
        }
        res.status(200).json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        console.log('Error deleting doctor details:', error)
        res.status(500).json({ success: false, message: "Failed to delete doctor details" })
    }
}

exports.getAllDoctors = async (req, res) => {
    try {
        const { query } = req.query;
        let doctors = null;
        if (query) {
            doctors = await Doctor.find({
                isApproved: "approved",
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { specialization: { $regex: query, $options: "i" } }
                ]
            }).select("-password");
        }
        else {
            doctors = await Doctor.find({ isApproved: "approved" }).select("-password");
        }
        res.status(200).json({ success: true, message: "All doctors fetched successfully", data: doctors });
    } catch (error) {
        console.log('Error fetching all doctors detail:', error)
        res.status(500).json({ success: false, message: "Failed to fetch all doctors detail" })
    }
}

exports.getDoctorProfile = async (req,res)=>{
    const doctorId = req.userId;
    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
        res.status(404).json({ success: false, message: "Doctor not found" })
        }
        const {password,...rest} = doctor._doc;
        const appointments = await Booking.find({doctor:doctorId})
        res.status(200).json({success:true,message:"Getting doctor details",data:{...rest,appointments}})
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch doctor profile" })
    }
}