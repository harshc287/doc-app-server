const express = require('express')
const appointmentController = require('../controllers/appointmentController')
const { auth, doctor} = require('../middleware/auth')

const router = express.Router()


router.post('/createAppoint', auth, appointmentController.createAppointment)
router.patch('/statusUpdateByDoctor/:ID', auth, doctor, appointmentController.statusUpdateByDoctor)
router.get('/getAppointmentsByUser', auth, appointmentController.getAppointmentsByUser)
router.get('/showAppointmentsOfDoctor', auth, appointmentController.showAppointmentsOfDoctor)
router.put('/updateAppointment/:ID',auth, appointmentController.updateAppointment)
router.delete('/deleteAppointment/:ID', auth, appointmentController.deleteAppointment )

module.exports = router