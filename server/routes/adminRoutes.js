const express = require('express');
const router = express.Router();
const { 
  getAllProperties, 
  approveProperty, 
  rejectProperty, 
  getAllOwners, 
  getAllTenants, 
  getAllBookings 
} = require('../Controller/adminController')

const { protect} = require('../middleware/authMiddleware'); 


router.use(protect);

// Properties
router.get('/properties', getAllProperties);
router.patch('/properties/approve/:id', approveProperty);
router.patch('/properties/reject/:id', rejectProperty);

// Users
router.get('/owners', getAllOwners);
router.get('/tenants', getAllTenants);

// Bookings
router.get('/bookings', getAllBookings);

module.exports = router;