const express = require('express')
const cors = require('cors')
const server = express()
const path = require('path');


const dotenv = require('dotenv')
dotenv.config()

const DbConnection  = require('./config/database')
DbConnection()

const userRoutes  = require('./routes/userRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const ContactRoutes = require('./routes/contactRoutes')
const SupportRoutes = require('./routes/supportRoutes')


server.get('/', (req,res)=>{
    res.send('server is live')
})


server.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
}))


server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.use(express.json())

server.use('/api', ContactRoutes)
server.use('/api/auth', userRoutes)

server.use('/api', dashboardRoutes)
server.use('/api/properties', propertyRoutes)

server.use('/api/admin', adminRoutes)

server.use('/api/booking', bookingRoutes )

server.use('api/support', SupportRoutes)



const port = process.env.PORT
server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})

