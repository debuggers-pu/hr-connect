const leaveModel = require("../model/leave");

const createLeave = async (req, res) => {
  try {
    const { employeeName, reason, startDate, endDate } = req.body;
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
    const leave = await leaveModel.findByIdAndUpdate(
      req.params.id,
      {
        employeeName,
        reason,
        startDate,
        endDate,
      },
      { new: true }
    );
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    // if (leave.user.toString() !== req.user.id)
    //   return res.status(401).json({ error: "Not authorized" });
    res.status(200).json({ message: "Leave updated successfully", leave });
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
