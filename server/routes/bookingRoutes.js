const express = require('express')
const router  =  express.Router()
const {initiateBooking, verifyPayment, getTenantDetails, getBookingById, updateBookingStatus
   , getMyBookings, acceptBooking, getAdminBookings, deleteBooking, getOwnerBookings

}  = require('../Controller/bookingController')
const {protect} = require('../middleware/authMiddleware')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage })


router.post('/initiate', protect, upload.single('paymentScreenshot'), initiateBooking);


router.post('/verify-manual', protect, verifyPayment);


router.get('/get-tenant-details', protect, getTenantDetails);


router.get('/details/:id', protect, getBookingById);

router.put('/update-status/:id', updateBookingStatus);

router.get('/my-bookings', protect, getMyBookings);

router.put("/bookings/:id/accept", protect, acceptBooking);

// Add this line to your booking routes
router.get('/admin/all', getAdminBookings);

router.delete('/:id',  deleteBooking);

router.get('/my-bookings', protect, getOwnerBookings);

module.exports = router
