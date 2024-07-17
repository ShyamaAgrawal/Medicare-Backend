const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Doctor = require('../models/Doctor')

exports.authenticate = async (req, res, next) => {
    //get token from headers
    const authToken = req.headers.authorization;

    //check if token exists
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(401).json({success:false,message:"No token, authorization failed"})
    }
    try {
        const token = authToken.split(" ")[1];
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        req.userId = decoded.userId 
        req.role = decoded.role 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message:"Token is expired"})
        }
        return res.status(401).json({success:false,message:"Invalid Token"})
    }
}

exports.restrict = roles => async (req, res, next) => {
    const userId = req.userId;
    // console.log(userId)
    let user = null;
    const patient = await User.findById(userId)
    const doctor = await Doctor.findById(userId)
    if (patient) {
        user = patient
    }
    if (doctor) {
        user = doctor
    }
    // console.log(user)
    if (!roles.includes(user.role)) {
        return res.status(401).json({success:false,message:"You are unauthorized"})
    }
    next();
}