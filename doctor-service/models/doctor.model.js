const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    experience: {
        type: Number, // in years
        default: 0
    },

    phone: {
        type: String
    },

    fees: {
        type: Number,
        default: 500 // default consultation charge
    },

    availability: [
        {
            day: {
                type: String,
                enum: [
                    "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday", "Sunday"
                ],
                required: true
            },
            startTime: {
                type: String, 
                required: true
            },
            endTime: {
                type: String, 
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
