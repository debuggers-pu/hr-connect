const userModel = require("../model/user");
const leaveModel = require("../model/leave");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_JWT = process.env.SECRET_JWT;

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      if (await bcrypt.compare(password, existingUser.password)) {
        if (existingUser.userType === "user") {
          return res.status(500).json({ error: "invalid credentials" });
        } else {
          const token = jwt.sign(
            {
              email: existingUser.email,
              id: existingUser._id,
              userType: existingUser.userType,
              isLoggedIn: true,
            },
            SECRET_JWT,
            { expiresIn: "1d" }
          );
          res.status(200).json({
            message: "Admin login success",
            admin: existingUser,
            token: token,
          });
        }
      } else {
        return res.status(500).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(404).json({ error: "User not found with this email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong while logging in" });
  }
};

const onlyAdmin = async (req, res) => {
  console.log("I got here");
  return res.status(200).json({ message: "Wow I am admin" });
};

const updateUserType = async (req, res) => {
  const { userType } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        userType: userType,
      },
      { new: true, runValidators: true, context: "query" }
    );
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User type updated successfully", user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while updating user type" });
  }
};

// update leave status of user by admin
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await leaveModel.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      { new: true, runValidators: true, context: "query" }
    );
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }
    res.status(200).json({ message: "Leave status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while updating leave status" });
  }
};
module.exports = { adminLogin, onlyAdmin, updateUserType, updateLeaveStatus };
