const express = require('express')
const router = express.Router();
const userController = require('../Controllers/userController.js');
const { authenticate, restrict } = require('../middlewares/authentication.js');


router.get('/users', authenticate, restrict(["patient"]), userController.getAllUsers);
router.get('/users/:id', authenticate, restrict(["patient"]), userController.getUserDetails);
router.put('/users/:id', authenticate, restrict(["patient"]), userController.updateUser);
router.delete('/users/:id', authenticate, restrict(["patient"]), userController.deleteUser);

router.get('/users/profile/me', authenticate, restrict(["patient"]), userController.getUserProfile);
router.get('/users/appointments/my-appointments', authenticate, restrict(["patient"]), userController.getMyAppointments);


module.exports = router;