const express = require('express')
const userController = require("../controllers/userController")

const{auth} = require('../middleware/auth')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getUserInfo', auth, userController.getUserInfo)
router.get('/doctorList', auth, userController.doctorList)
module.exports = router