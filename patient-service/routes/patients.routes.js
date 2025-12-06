const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', patientController.register);
router.post('/login', patientController.login);
router.put('/profile', authMiddleware.authenticateToken, patientController.addHealthInfo);
router.put('/update-profile', authMiddleware.authenticateToken, patientController.settings);
router.get('/profile', authMiddleware.authenticateToken,patientController.getProfile);

module.exports = router;