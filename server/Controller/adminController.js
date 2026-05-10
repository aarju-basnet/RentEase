const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const Booking = require('../models/BookingModel');
const sendEmail = require('../utils/mailer')
const  propertyApprovedTemplate  =require('../utils/propertyApprovedTemplate')

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'fullName email phoneNumber');
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    property.status = 'approved';
    await property.save();

    // Fetch the owner details manually to get the email
    const owner = await User.findById(property.owner);
    
   // if (owner && owner.email) {
      // Since sendEmail is the function itself, we call it directly
     // await sendEmail({
       // email: owner.email,
        //subject: `Your property "${property.title}" is now LIVE!`,
        //html: propertyApprovedTemplate(owner.fullName || "Owner", property.title)
     // });
    //}
    
    res.json({ success: true, property });
  } catch (err) {
    
    console.error("Internal Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    property.status = 'rejected';
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Users
const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('+paymentDetails');
    res.json({ success: true, owners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllTenants = async (req, res) => {
  try {
    const tenants = await User.find({ role: 'tenant' });
    res.json({ success: true, tenants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tenant', 'fullName email')
      .populate({
        path: 'property',
        select: 'title price location owner', // Added 'owner' here
        populate: {
          path: 'owner',
          select: 'fullName email' // This grabs the Owner's name from the User model
        }
      });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// In your backend owner controller
const togglePaymentStatus = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    // Toggle the status (you may need to add 'isPaid' to your User Schema)
    owner.isPaid = !owner.isPaid; 
    await owner.save();
    res.json({ success: true, isPaid: owner.isPaid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

async function transferToOwner(req,res){

  try {
    const { ownerId } = req.params;

    // Update all 'completed' bookings for this specific owner
    const result = await Booking.updateMany(
      { 
        owner: ownerId, 
        paymentStatus: 'completed', 
        isTransferredToOwner: false 
      },
      { 
        $set: { 
          isTransferredToOwner: true, 
          transferredAt: new Date() 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No pending payments found for this owner." 
      });
    }

    res.json({ 
      success: true, 
      message: `Successfully transferred payments for ${result.modifiedCount} bookings.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllOwners,
  getAllTenants,
  getAllBookings,
  togglePaymentStatus,
  transferToOwner
};