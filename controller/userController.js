const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');  
// const crypto = require('crypto');

require("dotenv").config();

const transporter = require("../helper/transporterHelper");
const sendVerifyEmail = require("../helper/sendVerifyEmailHelper");
const userModel = require("../model/user");
const SECRET_JWT = process.env.SECRET_JWT;

const registerUser = async (req, res) => {
  //data from req
  const { fullName, username, email, userType, password, phoneNumber } =
    req.body;
  try {
    // Checking for existing user
    const existingUser = await userModel.findOne({
      email: email,
    });

    if (existingUser) {
      return res
        .status(500)
        .json({ Error: "User with this email already exists!" });
    }
    const existingUsername = await userModel.findOne({ username: username });
    if (existingUsername) {
      return res.status(500).json({ error: "Username already exists" });
    }
    // Hashing Password with salt 10
    const hashedPassword = await bcrypt.hash(password, 10);
    let avatarUrl = null;

    // Check if file was uploaded
    if (req.file) {
      avatarUrl = `http://${req.headers.host}/${req.file.path}`;
    }
    const url = avatarUrl?.split("/public").join("");
    const newUser = await userModel.create({
      fullName: fullName,
      email: email,
      username: username,
      password: hashedPassword,
      userType: userType,
      avatar: url,
      phoneNumber: phoneNumber,
    });

    //generating token for registered user
    const token = jwt.sign({ email: email, id: newUser._id }, SECRET_JWT);

    //sending email for verification with helper function
    sendVerifyEmail(fullName, email, newUser._id);

    return res.status(200).json({
      message: "User registered successfully, please verify your email",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "User registration failed!" });
  }
};

// verify email
const emailVerify = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.query.id });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user && user.emailVerified === true) {
      return res.status(500).json({ message: "User already verified." });
    }
    const updatedInfo = await userModel.updateOne(
      {
        _id: req.query.id,
      },
      { $set: { emailVerified: true } }
    );
    res.status(200).json({ message: "User verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "User verification failed!" });
  }
};
module.exports = { registerUser, emailVerify };


