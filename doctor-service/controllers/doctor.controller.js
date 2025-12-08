const bcrypt = require('bcrypt');
const Doctor = require('../models/doctor.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports.register = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body
        if (!name || !email || !password || !specialization) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(409).json({ message: "Doctor already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialization
        });
        await newDoctor.save();
        const token = jwt.sign(
            { doctorId: newDoctor._id, email: newDoctor.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        res.status(201).json({
            message: "Doctor registered successfully", token, doctor: {
                id: newDoctor._id,
                name: newDoctor.name,
                email: newDoctor.email,
                specialization: newDoctor.specialization
            }
        });
    } catch (error) {
        console.error("Error in doctor registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { doctorId: doctor._id, email: doctor.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        res.status(200).json({
            message: "Login successful", token, doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error"+error.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const doctorId = req.user.doctorId;
        const doctor = await Doctor.findById(doctorId).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.log("Get Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.AddDoctorInfo = async (req, res) => {
    try {
        const { experience, fees, availability } = req.body;
        const doctorId = req.user.doctorId;

        const doctor = await Doctor.findById(doctorId).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        if (experience !== undefined) doctor.experience = experience;
        if (fees !== undefined) doctor.fees = fees;
        if (availability !== undefined) doctor.availability = availability;

        await doctor.save();

        res.status(200).json({
            message: "Doctor information updated successfully",
            doctor
        });

    } catch (error) {
        console.log("Add Doctor Info Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .select("-password");

        res.status(200).json(doctors);
    } catch (error) {
        console.log("Get All Doctors Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select("-password");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(doctor);

    } catch (error) {
        console.error("Get Doctor By ID Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.searchBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.query;

        const doctors = await Doctor.find({
            specialization: { $regex: specialization, $options: "i" }
        }).select("-password");

        res.status(200).json(doctors);
    } catch (error) {
        console.log("Doctor Search Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
