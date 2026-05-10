const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter your full name'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: [true, 'Please enter your phone number'],
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Password must be at least 8 characters']
    },

    resetpassword: {
        type: String,
        default: ''
    },

    resetpasswordexpiredAt: {
        type: Number,
        default: 0
    },

    role: {
        type: String,
        enum: ['tenant', 'owner'],
        default: 'tenant'
    },

    // 🆕 OWNER PAYMENT DETAILS (ADDED FEATURE)
    paymentDetails: {
        bankName: {
            type: String,
            default: ""
        },

        accountNumber: {
            type: String,
            default: ""
        },

        accountHolder: {
            type: String,
            default: ""
        },

        qrImage: {
            type: String, // store image URL (Cloudinary / local path)
            default: ""
        }
    },
    isPaid: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);