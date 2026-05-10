const Support = require('../models/Support');


async function support(req,res){

  try {
    const { subject, message } = req.body;

    const ticket = await Support.create({
      userId: req.user.id, // Assuming your auth middleware adds user to req
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: ticket,
      message: "Ticket submitted successfully!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not submit ticket'
    });
  }
}

module .exports = {support}