const express=require('express');
const router=express.Router();
const doctorController=require('../controllers/doctor.controller');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/register',doctorController.register);
router.post('/login',doctorController.login);
router.put('/profile',authMiddleware.authenticateToken,doctorController.AddDoctorInfo);
router.get('/profile',authMiddleware.authenticateToken,doctorController.getProfile);
router.get('/profiles',doctorController.getAllDoctors);
router.get('/get-doctor-by-id/:id',doctorController.getDoctorById);

module.exports=router;