const express = require('express')
const router  =  express.Router()
const {initiateBooking, verifyPayment}  = require('../Controller/bookingController')
const {protect} = require('../middleware/authMiddleware')

router.post('/initiate',
   protect,  initiateBooking);

router.get('/verify',  verifyPayment);

module.exports = router
