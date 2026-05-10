const express = require('express')
const router = express.Router()

const {TouchController} =require('../Controller/TouchController')

router.post('/contact', TouchController)

module.exports = router


