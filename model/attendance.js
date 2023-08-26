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
      unique: true,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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
