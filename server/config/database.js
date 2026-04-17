const mongoose = require('mongoose')

function DbConnection(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database is connected')
    }).catch((err)=>{
        console.log('Database error is:', err)
    })
}
 
module.exports = DbConnection