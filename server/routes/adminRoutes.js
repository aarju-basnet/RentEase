const express = require('express');
const router = express.Router();
const { 
  getAllProperties, 
  approveProperty, 
  rejectProperty, 
  getAllOwners, 
  getAllTenants, 
  getAllBookings , togglePaymentStatus, transferToOwner
} = require('../Controller/adminController')

const { protect} = require('../middleware/authMiddleware'); 
const{isAdmin} = require('../middleware/adminMiddleware')

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

router.put('/transfer-to-owner/:ownerId',   transferToOwner);

module.exports = router;