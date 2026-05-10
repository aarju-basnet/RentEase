const Property = require('../models/propertyModel')
const mongoose = require('mongoose')

const addProperty = async (req, res) => {
  try {
    const { title, location, price, type, description, bedrooms, bathrooms, area, furnished } = req.body;

    
    if (!title || !location || !price || !description || !bedrooms || !bathrooms || !area || !furnished || !req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields including at least one image are required"
      });
    }

    // Since you are using upload.array, req.files is an array
    const images = req.files.map(file => file.path);
    
    const property = await Property.create({
      title,
      location,
      price,
      type,
      description,
      bedrooms,
      bathrooms,
      area,
      furnished,
      images, // Matches your array of strings
      owner: req.user.id,
      status: 'pending' 
    });

    return res.status(201).json({
      success: true,
      message: "Property submitted successfully! Pending admin approval.",
      property
    });

  } catch (error) {
    console.error("Add Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


const getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;
    const properties = await Property.find({ owner: ownerId }).populate('bookedBy', 'fullName');

    const enrichedProperties = await Promise.all(properties.map(async (p) => {
      const propertyObj = p.toObject();

      if (p.status === 'booked') {
        // FLEXIBLE SEARCH: Find the booking that caused this property to be booked
        const booking = await mongoose.model('Booking').findOne({ 
          property: p._id, 
          // Look for either status accepted OR payment completed
          $or: [
            { status: 'accepted' },
            { paymentStatus: 'completed' }
          ]
        });
        
        propertyObj.currentBookingId = booking ? booking._id : null;
      }
      
      return propertyObj;
    }));

    res.status(200).json({ success: true, properties: enrichedProperties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    // ✅ ADDED: .populate("bookedBy", "fullName email")
    const property = await Property.findById(req.params.id)
      .populate("owner", "fullName email phoneNumber")
      .populate("bookedBy", "fullName email"); 

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // ... (Your existing permission logic for pending properties)

    res.status(200).json({ success: true, property });

  } catch (error) {
    console.error("Backend Error in getPropertyById:", error); 
    res.status(500).json({ success: false, error: error.message });
  }
};


const getThatProperties = async (req, res) => {
  try {
    // ✅ ADDED: .populate('bookedBy', 'fullName email') 
    // This ensures the frontend knows who the winner is!
    const properties = await Property.find({ 
        status: { $in: ['approved', 'booked'] } // Allow 'booked' ones to show up in "My Bookings"
      })
      .populate('owner', 'fullName email phoneNumber') 
      .populate('bookedBy', 'fullName') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message
    });
  }
}

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    await property.deleteOne(); 

    res.json({
      success: true,
      message: "Property removed from system"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};



const bulkDeleteProperties = async (req, res) => {
  try {
    const { propertyIds } = req.body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No properties selected for deletion"
      });
    }

    
    const isValid = propertyIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "One or more Property IDs are invalid"
      });
    }

    const result = await Property.deleteMany({
      _id: { $in: propertyIds }
    });

    res.json({
      success: true,
      message: `${result.deletedCount} properties successfully removed`,
      count: result.deletedCount
    });

  } catch (err) {
   
    console.error("Bulk Delete Error:", err);
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error during bulk delete",
      error: err.message
    });
  }
};


const deleteAllRejectedProperties = async (req, res) => {
  try {
    const result = await Property.deleteMany({ status: 'rejected' });

    res.json({
      success: true,
      message: `${result.deletedCount} rejected properties removed`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete all failed"
    });
  }
};






module.exports = { addProperty ,
   getOwnerProperties,
   getPropertyById,
     deleteProperty,
  bulkDeleteProperties,
  deleteAllRejectedProperties,
  getThatProperties
};