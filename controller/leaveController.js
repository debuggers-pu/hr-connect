const leaveModel = require("../model/leave");
const userModel = require("../model/user");

// Create leave usng the logged in user
const createLeave = async (req, res) => {
  try {
    const { reason, startDate, endDate , leaveType} = req.body;
    const user = req.user;
    const employeeName = req.user.name;
    const userId = user.id;

    // Check if the end date is smaller than the start date
    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date cannot be smaller than the start date" });
    }

    // Check if the leave exists
    const existingLeave = await leaveModel.findOne({
      employeeName: employeeName,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (existingLeave) {
      return res
        .status(400)
        .json({ error: "Leave already exists for the specified dates" });
    }

    // Create leave
    const leave = new leaveModel({
      userId,
      employeeName,
      reason,
      startDate,
      endDate,
      leaveType,
    });

    const newLeave = await leave.save();

    sendAdminNotification(
      userId,
      "New Leave Request",
      `New leave request from ${employeeName}`
    );

    res.status(201).json({ message: "Leave created successfully", newLeave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Leave creation failed!" });
  }
};
// update leave by id using the logged in user
const updateLeave = async (req, res) => {
  try {
    const { reason, startDate, endDate, leaveType } = req.body;
    const user = req.user;
    const employeeName = req.user.name;
    const userId = user.id;

    // Check if the end date is smaller than the start date
    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date cannot be smaller than the start date" });
    }

    // Check if the leave exists
    const existingLeave = await leaveModel.findOne({
      employeeName: employeeName,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (existingLeave) {
      return res
        .status(400)
        .json({ error: "Leave already exists for the specified dates" });
    }

    // Update leave
    const updatedLeave = await leaveModel.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        employeeName,
        reason,
        startDate,
        endDate,
        leaveType,
      },
      { new: true }
    );

    if (!updatedLeave)
      return res.status(404).json({ error: "Leave not found" });
    res
      .status(200)
      .json({ message: "Leave updated successfully", updatedLeave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating leave" });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const leave = await leaveModel.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    res.status(200).json({ message: "Leave deleted successfully", leave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting leave" });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const leave = await leaveModel.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    res.status(200).json({ leave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting leave" });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel.find();
    if (!leaves) return res.status(404).json({ error: "Leaves not found" });
    res.status(200).json({ leaves });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting leaves" });
  }
};

// get a list of leaves by the logged in user
const getLeavesByUser = async (req, res) => {
  try {
    const leaves = await leaveModel.find({ userId: req.user.id });
    if (!leaves) return res.status(404).json({ error: "Leaves not found" });
    res.status(200).json({ leaves });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting leaves" });
  }
};

sendAdminNotification = async (userId, title, message) => {
  try {
    const admin = await userModel.findOne({ userType: "admin", _id: userId });
    if (!admin) return;
    const notification = {
      userId,
      title,
      message,
    };
    // if (!admin.notification) {
    //   admin.notification = []; // Initialize admin.notifications as an array
    // }

    admin.notification.push(notification);
    await admin.save();

    console.log("Notification sent successfully");
  } catch (error) {
    console.log(error);
  }
};

const getLeaveNotifications = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const admin = await userModel.findOne({ userType: "admin", _id: userId });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const notifications = admin.notification;
    if (!notifications) {
      return res.status(404).json({ error: "Notifications not found" });
    }

    res
      .status(200)
      .json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get leave notifications" });
  }
};

// remove notification from admin if leave is approved or rejected
const removeNotification = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const admin = await userModel.findOne({ userType: "admin", _id: userId });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const notificationId = req.params.id;
    const notification = admin.notification.find(
      (notification) => notification._id == notificationId
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    admin.notification = admin.notification.filter(
      (notification) => notification._id != notificationId
    );
    await admin.save();
    res.status(200).json({ message: "Notification removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to remove notification" });
  }
};

module.exports = {
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
  getAllLeaves,
  getLeavesByUser,
  getLeaveNotifications,
  removeNotification,
};
