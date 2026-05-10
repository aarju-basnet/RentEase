const User = require('../models/userModel')
const JWT = require('jsonwebtoken')

async function isAdmin(req,res,next){
    
  try {
    // 1. Check if user is authenticated (req.user is usually set by a previous protect middleware)
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed to the controller
    } else {
      res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {isAdmin}