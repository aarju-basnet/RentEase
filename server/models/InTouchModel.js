const mongoose  =require('mongoose')

const touchSchema = new mongoose.Schema({
   fullName:{
        type:String,
        required:true,
        trim :true
    },

    emailAddress:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type:String,
        required:true,
        trim:true,
    
    },


}, {timestamps:true})

const touchModel = mongoose.model('getinTouch', touchSchema)

module.exports = touchModel
