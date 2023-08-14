const leaveModel = require("../model/leave");
const userModel = require("../model/user");

// Create leave usng the logged in user
const createLeave = async (req, res) => {
  try {
    const { reason, startDate, endDate } = req.body;
    const user = req.user;
    console.log(user);
    const employeeName = req.user.name;
    console.log(employeeName);
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
    });

    const newLeave = await leave.save();

    res.status(201).json({ message: "Leave created successfully", newLeave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Leave creation failed!" });
  }
};
// update leave by id using the logged in user
const updateLeave = async (req, res) => {
  try {
    const { reason, startDate, endDate } = req.body;
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


module.exports = {
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
  getAllLeaves,
  getLeavesByUser,
};
