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
    // send notification to user that his/her leave status has been updated
    if (status === "approved" || status === "rejected") {
      sendUserNotification(
        leave.userId,
        "Leave Status Updated",
        `Your leave request has been ${status}`
      );
    }
    res.status(200).json({ message: "Leave status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while updating leave status" });
  }
};

sendUserNotification = async (userId, title, message) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const notification = {
      title: title,
      message: message,
    };
    user.notification.push(notification);
    await user.save();
    console.log("Notification sent to user");
  } catch (error) {
    console.log(error);
  }
};

const getLeaveNotificationsForUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const notifications = user.notification;
    if (!notifications) {
      return res.status(404).json({ error: "No notification found" });
    }
    res
      .status(200)
      .json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while fetching notifications" });
  }
};

// remove notification from user notification array
const removeNotification = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const notification = user.notification.find(
      (notification) => notification._id == req.params.id
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    const notifications = user.notification;

    const index = notifications.indexOf(notification);
    notifications.splice(index, 1);
    await user.save();
    res.status(200).json({ message: "Notification removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while removing notification" });
  }
};

module.exports = {
  adminLogin,
  onlyAdmin,
  updateUserType,
  updateLeaveStatus,
  getLeaveNotificationsForUser,
  removeNotification,
};
