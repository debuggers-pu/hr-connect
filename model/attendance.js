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
    date:{
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
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
