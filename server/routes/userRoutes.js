const express = require('express')
const router = express.Router()

const {register, login, logout, sendotp, verifyotp} = require('../Controller/userController')
const {tenantDashboard, ownerDashboard, adminDashboard } = require('../Controller/dashboardController')
const{protect, authorizeRoles} = require('../middleware/authMiddleware')

router.post('/register',  register)
router.post('/login', login)
router.post('/logout', logout)


router.get('/tenant/dashboard', protect, authorizeRoles('tenant'), tenantDashboard);
router.get('/property-owner/dashboard', protect, authorizeRoles('owner'), ownerDashboard);
router.get('/admin/dashboard', protect, authorizeRoles('admin'), adminDashboard);

router.post('/reset-password', sendotp)
router.post('/enter-otp', verifyotp)

module.exports = router



