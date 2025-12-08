const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.post('/create-appointment', appointmentController.createAppointment);
router.get('/get-patient-appointments/:id', appointmentController.getPatientAppointments);
router.get('/get-doctor-appointments/:id', appointmentController.getDoctorAppointments);
router.put('/cancel-appointment/:id', appointmentController.cancelAppointment);         
router.post('/confirm-appointment/:id', appointmentController.confirmAppointment);  

module.exports = router;