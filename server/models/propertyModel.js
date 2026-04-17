const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['Apartment', 'Room', 'Villa', 'House', 'Studio'], default: 'Apartment' },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: String },
  furnished: { type: String, default: 'Unfurnished' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' } // <-- new
}, { timestamps: true });

const propertyModel =  mongoose.model('Property', propertySchema)
module.exports = propertyModel
