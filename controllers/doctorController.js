const {Doctor , User} = require("../models")



const applyDoctor = async (req, res) => {
    try {
        const {Specialist, fees} = req.body
        const createdBy = req.user.id

        if (req.user.role === "Doctor") {
            return res.status(400).json({
                success: false,
                msg: "You are already a Doctor"
            });
    }

        const existing =  await Doctor.findOne({where: {createdBy}})
        if(existing){
            return res.status(400).json({success:false, msg: "Doctor Application Already submitted"})
        }

        const doctor = await Doctor.create({
            Specialist, fees, createdBy
        })
        return res.status(201).json({success:true, msg:"Doctor Applied Successfully", data:doctor})


    } catch (error) {
        console.error(error)
        res.status(500).send({msg:"Server Error", success: false})
    }
}


const docStatus = async (req, res) => {
    try {
        const{DoctorID} = req.params
        const{status} = req.body

        const doctor = await Doctor.findByPk(DoctorID)
        if(!doctor){
            return res.status(404).json({
                success: false,
                msg: "Doctor not found"
      });
    }
      doctor.status = status
      await doctor.save()

    if(status === "Accepted"){
        await User.update(
            {role: "Doctor"},
            {where: {id: doctor.createdBy}}
        )
    }
    return res.status(200).json({success:true, msg:`Doctor application ${status}`})

    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, msg:"Server Error"})
    }
}

const getDoctorInfo = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: {createdBy:req.user.id}

        })
        if(!doctor){
            return res.status(404).send({success: false, data:doctor})

        }
        res.status(200).send({success:true, data:doctor})
        
    } catch (error) {
        console.error(error)
        res.status(500).send({msg:"server error"})
    }
}

const updateDoctor = async (req, res) => {
    try {
        const{Specialist, fees} = req.body
        const doctor = await Doctor.findOne({
            where:{createdBy: req.user.id}
        })
        
        if(!doctor){
          return res.status(404).send({
            success: false,
            msg: "Doctor profile not found"
        });        
        }

        doctor.Specialist = Specialist ?? doctor.Specialist
        doctor.fees = fees ?? doctor.fees
        doctor.updatedBy = req.user.id

        await doctor.save()

            res.status(200).send({
            success: true,
            msg: "Doctor profile updated successfully",
            data: doctor
    });

    } catch (error) {
        console.error(error)
        res.status(500).send({msg:"server error"})
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { DoctorID } = req.params;

    const doctor = await Doctor.findByPk(DoctorID);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        msg: "Doctor not found"
      });
    }
    await Doctor.destroy({ where: { id: DoctorID } });
        await User.update(
      { role: "User" },
      { where: { id: doctor.createdBy } }
    );

        res.status(200).send({
      success: true,
      msg: "Doctor deleted successfully"
    });

        
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "Server Error" });
    }
}

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { status: "Accepted" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

module.exports ={applyDoctor, docStatus, getDoctorInfo, updateDoctor, deleteDoctor, getAllDoctors}