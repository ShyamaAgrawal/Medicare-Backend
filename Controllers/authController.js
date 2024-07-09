const User = require('../models/User.js')
const Doctor = require('../models/Doctor.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
         let { name, email, password, role, gender, photo } = req.body;
        if (!name || !email || !password || !role || !gender) {
            return res.status(400).json({ error: 'Please provide all the information' });
        }
        let existingUser = null;
        if (role === 'patient') {
            existingUser = await User.findOne({ email });
        }
        if (role === 'doctor') {
            existingUser = await Doctor.findOne({ email })
        }
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt)

        let newUser = null;
        if (role === 'patient') {
            newUser = new User({name,email,password:hashPassword,photo,gender,role})
        }
        if (role === 'doctor') {
            newUser = new Doctor({ name, email, password: hashPassword, photo, gender, role })
        }
        await newUser.save();
        res.status(201).json({ success:true,message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({success:false, message: error.message || 'An error occurred while registering user' });
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = null;
        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        if (patient) {
            user = patient
        }
        if (doctor) {
            user = doctor
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log(user)
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({status:false,message:"Invalid credentials"})
        }

        //generate token
        console.log(user._id)
        const token = jwt.sign({ userId: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: '15d' })

        let { role, appointments, ...rest } = user._doc;
        res.status(200).json({status:true,message:"Successfully logged in",token,data:{...rest},role});

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ status:false, message: 'An error occurred while logging in' });
    }
}