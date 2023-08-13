const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("CV", cvSchema);
