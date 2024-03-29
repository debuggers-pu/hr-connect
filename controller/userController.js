const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

const transporter = require("../helper/transporterHelper");
const sendVerifyEmail = require("../helper/sendVerifyEmailHelper");
const userModel = require("../model/user");
const SECRET_JWT = process.env.SECRET_JWT;

const registerUser = async (req, res) => {
  //data from req
  const {
    fullName,
    username,
    email,
    userType,
    password,
    phoneNumber,
    location,
  } = req.body;
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
    // const existingUsername = await userModel.findOne({ username: username });
    // if (existingUsername) {
    //   return res.status(500).json({ error: "Username already exists" });
    // }
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
      location: location,
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      return res.status(500).json({ error: "User not found with this email!" });
    }

    // check password
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(500).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        userType: existingUser.userType,
        name: existingUser.fullName,
        isLoggedIn: true,
      },
      SECRET_JWT,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Success",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(500).json({ error: "User not found with this email" });
    }

    //generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //hashing otp
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    //setting expiration time for otp at 10 min
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    //updating model with otp
    user.otp = hashedOTP;
    user.otpExpiration = otpExpiration;
    await user.save();

    const mailOptions = {
      from: "HRConnect",
      to: "dummydata1234567890@gmail.com",
      subject: "OTP for Resetting your password",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        console.log("Email sent with otp: " + info.response);
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Reset password failed" });
  }
};
//reset password
const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //verify otp
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (user.otp !== hashedOTP) {
      return res.status(500).json({ error: "Invalid OTP" });
    }

    //updating password and clearing otp
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = "";
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset success! Please login with new password",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Reset password failed" });
  }
};

//update user profile
const updateUserProfileById = async (req, res) => {
  try {
    const { fullName, email, password, username, phoneNumber, location } =
      req.body;
    let avatarUrl = null;

    // Check if file was uploaded
    if (req.file) {
      avatarUrl = `http://${req.headers.host}/${req.file.path}`;
    }
    const url = avatarUrl?.split("/public").join("");

    const update = {
      fullName: fullName,
      email: email,
      avatar: url,
      username: username,
      phoneNumber: phoneNumber,
      location: location,
    };

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      update.password = hashedPassword;
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: req.user.id },
      update,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully!", updatedInfo: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user profile" });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

//get user by id
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      res.status(400).json({ message: "No user found!" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while getting user" });
  }
};

// change password of user using old password to new password
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const matchPassword = await bcrypt.compare(oldPassword, user.password);

    if (!matchPassword) {
      return res.status(500).json({ error: "Invalid Credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while changing password" });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while getting users" });
  }
};

// get user by id
const getUserId = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while getting user" });
  }
};

// get total user count 
const getUserCount = async (req, res) => {
  try {
    const userCount = await userModel.countDocuments();
    if (userCount === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({ 
      message: "Total user count",
      userCount: userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while getting user count" });
  }
};


module.exports = {
  registerUser,
  emailVerify,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserProfileById,
  deleteUser,
  getUserById,
  changePassword,
  getAllUsers,
  getUserId,
  getUserCount
};
