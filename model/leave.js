const mongoose = require("mongoose");
const { status, leaveType } = require("../config/constant");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeName: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: Object.values(leaveType),
      default: "sick",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
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

module.exports = mongoose.model("Leave", leaveSchema);
