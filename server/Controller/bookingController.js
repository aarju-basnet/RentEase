
const Booking = require('../models/BookingModel');
const axios = require('axios'); // Import at the top

const initiateBooking = async (req, res) => {
  try {
    const { amount, propertyId } = req.body;
    
    // Khalti expects amount in Paisa (1 NPR = 100 Paisa)
    const amountInPaisa = Math.round(parseFloat(amount) * 100);

    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        "return_url": "http://localhost:3000/payment-success",
        "website_url": "http://localhost:3000",
        "amount": amountInPaisa,
        "purchase_order_id": `BOOK-${Date.now()}`,
        "purchase_order_name": `Booking for ${propertyId}`,
      },
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`, // Safe way to use keys
          'Content-Type': 'application/json'
        }
      }
    );

    // If successful, Axios puts the data inside .data
    res.json({ success: true, payment_url: khaltiResponse.data.payment_url });

  } catch (error) {
    // If Khalti returns an error, Axios catches it here
    console.error("Khalti API Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Could not initiate Khalti" });
  }
};


const verifyPayment = async (req, res) => {
  const { pidx } = req.query;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === "Completed") {
      // Update your DB
      await Booking.findOneAndUpdate({ pidx }, { paymentStatus: "completed" });
      res.redirect("http://localhost:3000/booking-success");
    } else {
      res.redirect("http://localhost:3000/payment-failed");
    }
  } catch (error) {
    res.redirect("http://localhost:3000/payment-failed");
  }
};

module.exports = { initiateBooking, verifyPayment}