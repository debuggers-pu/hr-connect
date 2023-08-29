const mongoose = require("mongoose");
const { location } = require("../config/constant");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeName: {
      type: String,
      required: true,
      unique: false,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    location: {
      type: String,
      enum: Object.values(location),
      default: "office",
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
