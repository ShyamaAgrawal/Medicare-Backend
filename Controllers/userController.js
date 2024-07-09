const User = require('../models/User.js');
const Booking = require('../models/Booking.js');
const Doctor = require('../models/Doctor.js');


exports.getUserDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const userDetails = await User.findById(id).select("-password");
        if (!userDetails) {
            return res.status(200).json({ success: true, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User details fetched successfully",data:userDetails });
    } catch (error) {
        console.log('Error fetching user details:', error)
        res.status(500).json({ success: false, message: "Failed to fetch user details" })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedUser) {
            return res.status(200).json({ success: true, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Details updated successfully", data: updatedUser });
    } catch (error) {
        console.log('Error updating user details:', error)
        res.status(500).json({success:false,message:"Failed to update user details"})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await User.findByIdAndDelete(id);
        if (!data) {
            return res.status(200).json({ success: true, message: "User not found" });
        }
        console.log(data)
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log('Error deleting user details:', error)
        res.status(500).json({ success: false, message: "Failed to delete user details" })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, message: "All users fetched successfully", data: users });
    } catch (error) {
        console.log('Error fetching all users detail:', error)
        res.status(500).json({ success: false, message: "Failed to fetch all users detail" })
    }
}

exports.getUserProfile = async (req,res)=>{
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if(!user){
        res.status(404).json({ success: false, message: "User not found" })
        }
        const {password,...rest} = user._doc;
        res.status(200).json({success:true,message:"Getting user details",data:{...rest}})
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user profile" })
    }
}

// get my appointments

exports.getMyAppointments = async(req,res)=>{
    try {
        //retrieve appointments from booking
        const bookings = await Booking.find({user:req.userId})
        //extract doctor ids from appointments
        const doctorIds = bookings.map(el=>el.doctor._id);
        //retrieve doctors using doctor ids
        const doctors = await Doctor.find({_id:{$in:doctorIds}}).select('-password');
        res.status(200).json({success:true,message:"Appointments are getting",data:doctors})
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch appointments" })
    }
}