const TouchModel = require('../models/InTouchModel')

async function TouchController(req,res){
    const{fullName, emailAddress, message}  = req.body

    if(!fullName || !emailAddress || ! message){
        return res.status(400).json({
            success:false,
            message:"All the fields are required"
        })
    }

    try{
        const contact = await TouchModel.create({
               fullName,
              emailAddress,
               message,

        })

         res.status(201).json({
            success:true,
            message:"Message sent successfully",
            data:contact
         })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

module.exports = {TouchController}
