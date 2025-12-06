const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new mongoose.Schema({
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
  
    age: {
      type: Number,
      required: true
    },
  
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"]
    },
  
    phone: {
      type: String
    },
  
    address: {
      type: String
    },
  
    medicalInfo: {
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", null],
        default: null
      },
      allergies: {
        type: [String],
        default: []
      },
      conditions: {
        type: [String],
        default: []
      }
    }
  }, { timestamps: true });
  

 module.exports= mongoose.model('Patient', PatientSchema);