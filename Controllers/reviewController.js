const Doctor = require('../models/Doctor')
const Review = require('../models/Review')

//get all reviews
exports.getAllReviewss = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.status(200).json({ success: true, message: "Successfull", data: reviews }) 
    } catch (error) {
        res.status(404).json({ success: false, message: "Not found" })
    }
}

//create review
exports.createReview = async (req, res, next) => {
    if (!req.body.doctor) req.body.doctor = req.params.doctorId
    if (!req.body.user) req.body.user = req.userId
    // console.log(req.body)


    let { rating, reviewText, doctor,user } = req.body;
    const newReview = new Review({ rating, reviewText,doctor ,user})

    try {
        let savedReview = await newReview.save();
        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: { reviews: savedReview._id }
        })
        res.status(200).json({ success: true, message: "Review Submitted", data: savedReview })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}