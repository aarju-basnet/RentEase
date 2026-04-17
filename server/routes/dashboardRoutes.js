const express = require('express')
const router  = express.Router()

const {tenantDashboard, ownerDashboard, adminDashboard } = require('../Controller/dashboardController')
const{protect, authorizeRoles} = require('../middleware/authMiddleware')

router.get('/tenant/dashboard', protect, authorizeRoles('tenant'), tenantDashboard);

router.get('/owner/dashboard', protect, authorizeRoles('owner'), ownerDashboard);

// Only admins can see this
router.get('/admin/dashboard', protect, authorizeRoles('admin'), adminDashboard);

module.exports = router;