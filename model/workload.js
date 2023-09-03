const mongoose = require("mongoose");

/// workload calculate from attendance clock in and clock out

const WorkloadSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  date: {
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
    required: true,
  },
  workload: {
    type: String,
  },
},{
  timestamps: true,
});


const Workload = mongoose.model("Workload", WorkloadSchema);