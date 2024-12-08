const User = require("../models/User.js");
const Doctor = require("../models/Doctor.js");
const Booking = require("../models/Booking.js");
const { Stripe } = require("stripe");

exports.getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

      console.log(doctor, "doctor")
      console.log(user,"user")

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    //create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SIDE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    console.log("session");
    //create new booking
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
      status: "approved",
    });



    doctor.appointments.push(booking._id);
    user.appointments.push(booking);


    try {
      await doctor.save();
      console.log("Doctor updated successfully");
    } catch (error) {
      console.error("Error saving doctor:", error);
    }

    // await doctor.save();
    // console.log("booking");
    await booking.save();
    await user.save();




    res
      .status(200)
      .json({ success: true, message: "Payment done successfully", session });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while creating checkout session",
    });
  }
};
