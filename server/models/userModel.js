const mongoose = require('mongoose');
const { type } = require('node:os');

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
    resetpassword:{
        type:String,
        default: ''
    },
    resetpasswordexpiredAt:{
        type:Number,
        default:0
    },

    role: {
        type: String,
        enum: ['tenant', 'owner'], 
        default: 'tenant'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);