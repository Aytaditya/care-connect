const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },

    doctorId: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },

    reason: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
