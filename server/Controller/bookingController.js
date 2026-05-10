
const Booking = require('../models/BookingModel');
const axios = require('axios'); // Import at the top
const Property = require('../models/propertyModel')
const User = require('../models/userModel')
const sendEmail =require('../utils/mailer')
const getApprovalTemplate= require('../utils/approvalTemplate')
const getRequestTemplate  = require('../utils/getRequestTemplate')

const initiateBooking = async (req, res) => {
  try {
    const { 
      amount, propertyId, ownerId, members, paymentType, 
      shiftSchedule, hometown, profession, purpose, systemFee 
    } = req.body;

  
    const screenshotPath = req.file ? req.file.path : null;

    if (!screenshotPath) {
      return res.status(400).json({ success: false, message: "Payment screenshot is required" });
    }

    const newBooking = new Booking({
      property: propertyId,
      tenant: req.user.id,
      owner: ownerId,
      advanceAmount: amount,
      systemFee: systemFee,
      members: members,
      paymentType: paymentType,
      shiftSchedule: shiftSchedule,
      
      paymentStatus: 'awaiting_verification', 
      paymentScreenshot: screenshotPath, 
      hometown,
      profession,
      purpose
    });

    await newBooking.save();

   
    console.log(`Admin notified of new payment verification for Booking ID: ${newBooking._id}`);

    res.status(201).json({ 
      success: true, 
      message: "Payment submitted. Admin is verifying your transaction!" 
    });

  } catch (error) {
    console.error("Booking Submission Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('tenant', 'fullName email')
      .populate('owner', 'fullName email')
      .populate('property', 'price title'); // Added price here

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const monthlyPrice = Number(booking.property.price);
    let ownerGets = 0;
    let systemFee = 0;

    // Apply your specific business logic based on paymentType
    if (booking.paymentType === 'advance') {
      // Owner base is 20% of rent
      ownerGets = monthlyPrice * 0.20; 
      // 1% fee on that 20%
      systemFee = ownerGets * 0.01; 
    } else {
      // Owner base is 100% of rent
      ownerGets = monthlyPrice; 
      // 3% fee on the full amount
      systemFee = ownerGets * 0.03; 
    }

    // Save the "Clean" amount to the database
    // This is what will show up in the Owner's notification
    booking.ownerEarnings = ownerGets; 
    booking.systemFee = systemFee;
    booking.paymentStatus = 'pending_owner_approval';
    
    await booking.save();

    try {
      const htmlContent = getRequestTemplate(
        booking.owner.fullName,
        booking.tenant.fullName,
        booking.property.title,
        ownerGets // Now correctly shows 600 (for 20% advance) or full price
      );
      // await sendEmail(...)
      /* 

      await sendEmail({

        email: booking.owner.email,

        subject: `Payment Verified: New Request for ${booking.property.title}`,

        html: htmlContent

      }); 

      */
    } catch (mailError) {
      console.error("Email failed:", mailError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: `Verified. Owner will receive NPR ${ownerGets}` 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getTenantDetails = async (req, res) => {
  try {
    
    const requests = await Booking.find({ owner: req.user.id })
      .populate('tenant', 'fullName') 
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Error fetching owner requests:", error);
    res.status(500).json({ success: false, message: "Server error fetching details" });
  }
};


async function getBookingById(req,res){
  try {
    
    const booking = await Booking.findById(req.params.id)
      .populate('tenant', 'fullName email phoneNumber') 
      .populate('property', 'title location images price'); 

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking request not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching booking details" });
  }
}


async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true } 
    )
    .populate('tenant', 'fullName email')
    .populate('property', 'title');

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // --- CRITICAL LOGIC: If payment is completed, lock the property and assign the winner ---
    if (status === 'completed' && updatedBooking.property) {
      
      
      await Property.findByIdAndUpdate(updatedBooking.property._id, { 
        status: 'booked',
        bookedBy: updatedBooking.tenant._id 
      });

      
      await Booking.updateMany(
        { 
          property: updatedBooking.property._id, 
          _id: { $ne: id }, 
          paymentStatus: 'pending' 
        },
        { paymentStatus: 'rejected' }
      );

      try {
        const htmlContent = getApprovalTemplate(
          updatedBooking.tenant.fullName, 
          updatedBooking.property.title, 
          updatedBooking.advanceAmount
        );
        // await sendEmail({...});
      } catch (mailError) {
        console.error("Email failed to send:", mailError.message);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: status === 'completed' ? "Property Booked & Tenant Notified!" : "Request Updated",
      booking: updatedBooking
    })

    // await sendEmail({

      //   email: updatedBooking.tenant.email,

//          subject: `Congratulations! Your stay at ${updatedBooking.property.title} is confirmed`,

  //        html: htmlContent

    //    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


// Get only the bookings for the currently logged-in tenant
const getMyBookings = async (req, res) => {
  try {
    // req.user.id comes from your auth middleware
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('property')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching your bookings" });
  }
}

const acceptBooking = async (req, res) => {
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Not found" });

  const property = await Property.findById(booking.property);

  if (property.status === "booked") {
    return res.status(400).json({ message: "Property already booked" });
  }

  // ✅ correct field
  booking.status = "accepted";
  await booking.save();

  // ❌ reject others
  await Booking.updateMany(
    {
      property: booking.property,
      _id: { $ne: bookingId }
    },
    { status: "rejected" }
  );

  // lock property
  property.status = "booked";
  await property.save();

  res.json({ success: true });
}


/// backend/controllers/bookingController.js

const getAdminBookings = async (req, res) => {
  try {
    // You MUST add .populate to turn IDs into real objects
    const bookings = await Booking.find()
      .populate({
        path: 'property',
        select: 'title location price images' // Fields you want from Property
      })
      .populate({
        path: 'owner',
        select: 'fullName email' // Fields you want from User (Owner)
      })
      .populate({
        path: 'tenant',
        select: 'fullName email' // Fields you want from User (Tenant)
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE BOOKING (Admin)
async function deleteBooking(req, res) {
  try {
    console.log("Deleting booking:", req.params.id);

    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Deleted:", deleted);
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
 

const getOwnerBookings = async (req, res) => {
  try {
    // req.user._id comes from your auth middleware
    const ownerId = req.user._id;

    const bookings = await Booking.find({ owner: ownerId })
      .populate('property', 'title location image') // Get property details
      .populate('tenant', 'fullName email phone')   // Get tenant details
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { initiateBooking, verifyPayment, getTenantDetails, updateBookingStatus, 
  
  getBookingById, getMyBookings, acceptBooking, getAdminBookings, deleteBooking, getOwnerBookings}