const bcrypt=require('bcrypt');
const Doctor=require('../models/doctor.model');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

module.exports.register=async(req,res)=>{
    try {
        const {name,email,password,specialization}=req.body
        if(!name || !email || !password || !specialization){
            return  res.status(400).json({message:"All fields are required"});
        }
        const doctor=await Doctor.findOne({email});
        if(doctor){
            return res.status(409).json({message:"Doctor already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newDoctor=new Doctor({
            name,
            email,
            password:hashedPassword,
            specialization
        });
        await newDoctor.save();
        const token=jwt.sign(
            {doctorId:newDoctor._id,email:newDoctor.email},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:3600000
        });
        res.status(201).json({message:"Doctor registered successfully",token,doctor:{
            id:newDoctor._id,
            name:newDoctor.name,
            email:newDoctor.email,
            specialization:newDoctor.specialization
        }});
    } catch (error) {
        console.error("Error in doctor registration:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const doctor=await Doctor.findOne({email});
        if(!doctor){
            return res.status(404).json({message:"Doctor not found"});
        }
        const isPasswordValid=await bcrypt.compare(password,doctor.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            {doctorId:doctor._id,email:doctor.email},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:3600000
        });
        res.status(200).json({message:"Login successful",token,doctor:{
            id:doctor._id,
            name:doctor.name,
            email:doctor.email,
            specialization:doctor.specialization
        }});
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}