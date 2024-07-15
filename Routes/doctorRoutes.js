const express = require('express')
const router = express.Router();
const doctorController = require('../Controllers/doctorController.js');
const { authenticate, restrict } = require('../middlewares/authentication.js');

router.get('/doctors',doctorController.getAllDoctors); 
router.get('/doctors/:id', doctorController.getDoctorDetails);
router.put('/doctors/:id',authenticate,restrict(["doctor"]), doctorController.updateDoctor);
router.delete('/doctors/:id', authenticate, restrict(["doctor"]), doctorController.deleteDoctor);

router.get('/doctors/profile/me',authenticate,restrict(["doctor"]), doctorController.getDoctorProfile);

module.exports = router;