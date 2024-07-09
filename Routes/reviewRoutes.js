const express = require('express')
const router = express.Router();
const reviewController = require('../Controllers/reviewController.js');
const { authenticate, restrict } = require('../middlewares/authentication');


router.get('/reviews', authenticate, reviewController.getAllReviewss)
router.post('/doctor/:doctorId/review',authenticate,restrict(['patient']),reviewController.createReview)



module.exports = router;

