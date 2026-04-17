const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const Booking = require('../models/BookingModel');


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
    res.json({ success: true, property });
  } catch (err) {
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
    const owners = await User.find({ role: 'owner' });
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
      .populate('property', 'title price location');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllOwners,
  getAllTenants,
  getAllBookings
};