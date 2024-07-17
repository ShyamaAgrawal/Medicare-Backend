const express = require('express');
const { getCheckoutSession } = require('../Controllers/bookingController');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)

module.exports = router;
