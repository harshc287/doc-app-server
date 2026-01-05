const User = require('./userModel')
const Doctor = require("./doctorModel")
const Appointment = require('./appointementModel')

// Patient → Appointment
User.hasMany(Appointment, { foreignKey: 'createdBy' })
Appointment.belongsTo(User, { foreignKey: 'createdBy', as: 'patient' })

// Doctor → Appointment
User.hasMany(Appointment, { foreignKey: 'doctorId' })
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' })

Doctor.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });
User.hasOne(Doctor, { foreignKey: 'createdBy', as: 'doctor' });

// Updated By → User
Appointment.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' })


module.exports = {
  User,
  Doctor,
  Appointment
};