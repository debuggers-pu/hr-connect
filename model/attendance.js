const mongoose = require("mongoose");
const { status, attendanceType } = require("../config/constant");

const attendanceSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      unique: true,
      required: true,
    },
    attendanceType: {
      type: String,
      enum: Object.values(attendanceType),
      default: "present",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: "pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
