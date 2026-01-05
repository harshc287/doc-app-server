const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, contactNumber, address } = req.body;

    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (existingUser) {
      return res
        .status(400)
        .send({ msg: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);

    const regUser = await User.create({
      name,
      email,  
      password: hashedPassword,
      contactNumber,
      address,
    });

    res.status(200).send({ msg: "Registered Successfully", success: true });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).send({ msg: "server Error" });
  }
};

const login = async (req, res) => {
  console.log(req.body, "****************");

  try {
    const { email, password } = req.body;

    const loggedUser = await User.findOne({
      where: { email: email },
    });
    console.log(loggedUser, "logged user**************************");

    if (!loggedUser) {
      return res.status(400).send({ msg: "User Not Found", success: false });
    }

    const isMatch = await bcrypt.compare(password, loggedUser.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Password Incorrect",
        success: false,
      });
    }
    const payload = { id: loggedUser.id, role: loggedUser.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(202)
      .send({ msg: "Logged Successfully", success: true, token: token });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({ msg: "server error" });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: "Doctor" },
      attributes: ["id", "name"],
    });
    res.status(200).send({ doctors: doctors, success: true });
  } catch (error) {
    res.status(500).send({ msg: "server error" });
  }
};

const profileImage = async (req, res) => {
  try {
    if(!req.file){
      return res.status(400).send({msg:"no Image Uploaded"})

    }

    await User.update(
      {profileImage: `/uploads/profiles/${req.file.filename}`},
      {where : {id: req.user.id}}
    )

    res.status(200).send({
      success:true,
      msg: "Profile image uploaded successfully"
    })
    
  } catch (error) {
    res.status(500).send({msg:"Server error"}) }
}

const getAllUsers = async(req, res) => {
  try {
     const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
}


module.exports = { register, login, getUserInfo, doctorList, profileImage, getAllUsers};
