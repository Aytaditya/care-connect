const Patient=require('../models/patient.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

module.exports.register=async(req,res)=>{
    const {name,email,password,age,gender}=req.body;
    if (!name || !email || !password || !age || !gender) {
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
        gender
    }
    await Patient.create(patient);
    // jwt token
    const token=jwt.sign({id:patient._id,email:patient.email},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.status(201).json({
        message: "Patient registered successfully",
        token,
        patient: {
            id: patient._id,
            name: patient.name,
            email: patient.email,
            age: patient.age,
            gender: patient.gender
        }
    });
}