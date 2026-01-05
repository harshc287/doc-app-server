const Appointment = require("../models/appointementModel");

async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const createdBy = req.user.id;

    const newAppoint = await Appointment.create({
      dateTime,
      doctorId,
      createdBy,
    });

    if (!newAppoint) {
      res.status(201).send({ msg: "appointment not created", success: false });
    }

    res
      .status(200)
      .send({
        msg: "appointment created successfully",
        success: true,
        data: newAppoint,
      });
  } catch (error) {
    res.status(500).send({ msg: "Server error" });
  }
}

async function statusUpdateByDoctor(req, res) {

  try {
  const { ID } = req.params;
  const { status } = req.body;

  const allowedStatus = ['Pending','Accepted','Completed','Reject']

    if(!allowedStatus.includes(status)){
      return res.status(400).send({
        success:false,
        msg:"Invalid status value",
      })
    }

    const [updateRows] = await Appointment.update(
      {
        status,
        updatedBy: req.user.id,
      },
      {
        where: { id: ID ,
        doctorId:req.user.id,
        },
      }
    );
    if (updateRows === 0) {
      return res.status(404).send({
        success: false,
        msg: "Appointment not found or not authorized",
      });
    }
       return res.status(200).send({
      success: true,
      msg: "Appointment status updated successfully",
    });
  } catch (error) {
    res.status(500).send({ msg: "server error" });
  }
}

async function updateAppointment(req, res) {
  const { ID } = req.params;
  const { dateTime, doctorId } = req.body;

  try {
    const appointment = await Appointment.findOne({
      where: {
        id: ID,
        createdBy: req.user.id,
      },
    });
    if (!appointment) {
      return res
        .status(404)
        .send({ success: false, msg: "Appointment not found or Unauthorized" });
    }
    await appointment.update({ dateTime, doctorId, updatedBy: req.user.id });

    res
      .status(200)
      .send({
        msg: "appointments updated successfully",
        success: true,
        data: appointment,
      });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function deleteAppointment(req, res) {
  const { ID } = req.params;
  try {
    const deleted = await Appointment.destroy({
      where: {
        id: ID,
        createdBy: req.user.id,
      },
    });
    if (deleted === 0) {
      return res.status(404).send({
        success: false,
        msg: "Appointment not found",
      });
    }

    res
      .status(200)
      .send({ msg: "appointments deleted successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function getAppointmentsByUser(req, res) {
  try {

    let whereCondition = {};

    if (req.user.role === "User") {
      whereCondition.createdBy = req.user.id;
    }

    if (req.user.role === "Doctor") {
      whereCondition.doctorId = req.user.id;
    }

    const appointments = await Appointment.findAll({
      where: whereCondition,
      order: [["dateTime", "DESC"]],
    });

     return res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).send({ msg: "server error" });
  }
}

async function showAppointmentsOfDoctor(req, res) {
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
      order: [["dateTime", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
    });

  } catch (error) {
    res.status(500).send({success: false, msg: "server error" });
  }
}

module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  
};
