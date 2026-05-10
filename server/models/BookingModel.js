const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', 
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  owner: { // NEW: To notify the owner
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  transactionId: { // Made NOT required for manual flow
    type: String, 
    unique: true,
    sparse: true // Allows multiple nulls if needed
  },
  advanceAmount: {
    type: Number,
    required: true,
  },
  systemFee: { 
    type: Number,
  },
  members: { // NEW
    type: Number,
    default: 1
  },
  shiftSchedule: { // NEW
    type: String,
  },
  stayDuration: { 
  type: Number,
  default: 1
},
hometown: 
{ type: String, 
  required: true },

profession:
 { type: String,
   required: true },

purpose: { 
  type: String, 
  enum: ['Studying', 'Doing Job', 'Business', 'Other'],
  required: true 
},
  paymentType: { type: String, enum: ['advance', 'full'] },

  paymentScreenshot: { 
    type: String, 
    required: false 
  }, 

  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'awaiting_verification', 'pending_owner_approval', 'rejected_and_refunded'],
    default: 'pending',
  },
  isTransferredToOwner: { type: Boolean, default: false }, // Admin -> Owner transfer
  transferredAt: { type: Date },
  tenantAmountPaid: { type: Number, default:0 },
  ownerAmountDue: { type: Number, default:0},
  adminCommission: { type: Number, default:0 },
  
}, { timestamps: true });
  
module.exports = mongoose.model('Booking', bookingSchema);