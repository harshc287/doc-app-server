const express = require('express')
const doctorController = require("../controllers/doctorController")

const{auth, doctor, admin} = require('../middleware/auth')


const router = express.Router()

router.post('/apply', auth, doctorController.applyDoctor)
router.get('/getDoctorInfo', auth, doctor, doctorController.getDoctorInfo)
router.patch('/updateDoctor', auth, doctor, doctorController.updateDoctor)
router.patch('/docStatus/:DoctorID', auth, admin, doctorController.docStatus)
router.delete('/deleteDoctor/:DoctorID', auth, admin, doctorController.deleteDoctor)
router.get("/getAllDoctors", auth, doctorController.getAllDoctors)


module.exports = router;