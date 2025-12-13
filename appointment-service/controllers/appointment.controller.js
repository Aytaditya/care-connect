const axios = require("axios");        
const amqp = require("amqplib");
const Appointment=require('../models/appointment.model')
const {subscribeToQueue,publishToQueue}=require('../service/rabbit');

module.exports.createAppointment=async(req,res)=>{
    try {
        const { patientId, doctorId, date, time, reason } = req.body;
        if (!patientId || !doctorId || !date || !time) {
            return res.status(400).json({message:"All fields are required"});
        }
        // validating doctor
        const doctorResponse=await axios.get(`http://doctor-service:8002/get-doctor-by-id/${doctorId}`);
        console.log(doctorResponse.data);
        const doctorData=doctorResponse.data;
        if(!doctorResponse.data){
            return res.status(404).json({message:"Doctor not found"});
        }
        // validating patient
        const patientResponse=await axios.get(`http://patient-service:8001/get-patient-by-id/${patientId}`);
        console.log(patientResponse.data);
        const patientData=patientResponse.data;
        if(patientResponse.status!==200){
            return res.status(404).json({message:"Patient not found"});
        }
        const appointmentDetail={
            patientName:patientData.name,
            patientEmail:patientData.email,
            doctorName:doctorData.name,
            doctorEmail:doctorData.email,
            date,
            time,
            reason,
            status:"pending"
        }
        const newAppointment=new Appointment({
            patientId,
            doctorId,
            date,
            time,
            reason
        });
        const savedAppointment=await newAppointment.save();
        // Publish appointment created event
        await publishToQueue("appointment_created",JSON.stringify(appointmentDetail));

        return res.status(201).json({
            message:"Appointment created successfully",
            appointment:savedAppointment
        });
        
    } catch (error) {
        console.log("Error in creating appointment:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.params.id;
        const appointments = await Appointment.find({ patientId });

        res.status(200).json(appointments);
    } catch (error) {
        console.log("Get Patient Appointments Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const appointments = await Appointment.find({ doctorId });

        res.status(200).json(appointments);
    } catch (error) {
        console.log("Get Doctor Appointments Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.cancelAppointment = async (req, res) => {
    try {
        const apptId = req.params.id;

        const appt = await Appointment.findById(apptId);
        if (!appt) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appt.status = "cancelled";
        await appt.save();

        res.status(200).json({
            message: "Appointment cancelled",
            appointment: appt
        });

    } catch (error) {
        console.log("Cancel Appointment Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.confirmAppointment=async(req,res)=>{
    try {
        const appointmentId  = req.params.id;
        const {doctorId} = req.body;
        const appointment=await Appointment.findById(appointmentId);
        console.log(appointment);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if(appointment.doctorId.toString()!=doctorId){
            return res.status(403).json({ message: "Unauthorized action" });
        }
        if (appointment.doctorId.toString() !== doctorId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }
        appointment.status = "confirmed";
        await appointment.save();
        res.status(200).json({
            message: "Appointment confirmed",
            appointment
        });
    } catch (error) {
        console.log("Confirm Appointment Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
