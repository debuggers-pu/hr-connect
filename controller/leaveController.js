const leaveModel = require("../model/leave");

// Create leave
const createLeave = async (req, res) => {
  try {
    const { employeeName, reason, startDate, endDate } = req.body;
    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date cannot be smaller than the start date" });
    }
    // Check if the employee already has a leave for the specified dates
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

    const leave = new leaveModel({
      employeeName,
      reason,
      startDate,
      endDate,
      user: req.user.id,
    });

    const newLeave = await leave.save();

    res.status(200).json({ message: "Leave created successfully", newLeave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating leave" });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { employeeName, reason, startDate, endDate } = req.body;
    const leaveId = req.params.id;

    // Check if the end date is smaller than the start date
    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date cannot be smaller than the start date" });
    }

    // Check if the leave exists
    const leave = await leaveModel.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    // Check if the updated dates conflict with existing leaves
    const existingLeave = await leaveModel.findOne({
      employeeName: employeeName,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
    console.log(existingLeave);

    if (existingLeave) {
      return res
        .status(400)
        .json({ error: "Leave already exists for the specified dates" });
    }

    // Update leave details
    leave.employeeName = employeeName;
    leave.reason = reason;
    leave.startDate = startDate;
    leave.endDate = endDate;

    const updatedLeave = await leave.save();

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

module.exports = {
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
  getAllLeaves,
};
