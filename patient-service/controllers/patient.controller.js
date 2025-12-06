const Patient=require('../models/patient.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

module.exports.register=async(req,res)=>{
    try {
        const {name,email,password,age,gender,phone}=req.body;
    if (!name || !email || !password || !age || !gender || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user=await Patient.findOne({email});
    if(user){
        return res.status(409).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const patient={
        name,
        email,
        password:hashedPassword,
        age,
        gender,
        phone
    }
    await Patient.create(patient);
    // jwt token
    const token=jwt.sign({id:patient._id,email:patient.email},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.cookie('token',token,{
        httpOnly:true,
        secure:false, // Set to true if using HTTPS
        maxAge:3600000 // 1 hour in milliseconds
    });
    res.status(201).json({
        message: "Patient registered successfully",
        token,
        patient: {
            id: patient._id,
            name: patient.name,
            email: patient.email,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone
        }
    });
    } catch (error) {
        console.log("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user=await Patient.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        // jwt token
        const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:false, 
            maxAge:3600000 
        });
        res.status(200).json({
            message: "Login successful",
            token,
            patient:{
                id:user._id,
                name:user.name,
                email:user.email,
                age:user.age,
                gender:user.gender,
                phone:user.phone
            }
        }) 
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.getProfile=async(req,res)=>{
    try {
        const user=req.user
        const patient=await Patient.findById(user.id).select('-password');
        if(!patient){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(patient);
    } catch (error) {
        console.log("Get Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.addHealthInfo=async(req,res)=>{
    try {
        const user=req.user;
        const {bloodGroup,allergies,conditions}=req.body;
        const patient=await Patient.findById(user.id);
        if(!patient){
            return res.status(404).json({message:"User not found"});
        }
        patient.medicalInfo.bloodGroup=bloodGroup||patient.medicalInfo.bloodGroup;
        patient.medicalInfo.allergies=allergies||patient.medicalInfo.allergies;
        patient.medicalInfo.conditions=conditions||patient.medicalInfo.conditions;
        await patient.save();
        res.status(200).json({message:"Health info updated successfully",medicalInfo:patient.medicalInfo});
        
    } catch (error) {
        console.log("Error Updating Health info",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports.settings=async(req,res)=>{
    try{
        const user=req.user;
        const {name,email,age,gender,phone}=req.body;
        const patient=await Patient.findById(user.id).select('-password');
        if(!patient){
            return res.status(404).json({message:"User not found"});
        }
        patient.name=name||patient.name;
        patient.email=email||patient.email;
        patient.age=age||patient.age;
        patient.gender=gender||patient.gender;
        patient.phone=phone||patient.phone;
        await patient.save();
        res.status(200).json({message:"Profile updated successfully",patient})
    }
    catch(error){
        console.log("Error in settings",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}