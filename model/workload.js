const mongoose = require("mongoose");

// work load schema for each employee in college for course and semester

const workLoadSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "semester",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    workload: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("workload", workLoadSchema);
