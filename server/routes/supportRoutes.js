const express = require('express');
const router = express.Router();
const { support } = require('../Controller/supportController')
const { protect } = require('../middleware/authMiddleware'); // Your existing auth middleware

// Only logged-in users can send support tickets
router.post('/', protect, support);

module.exports = router;