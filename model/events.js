const mongoose = require("mongoose");
const { eventTypes } = require("../config/constant");

const eventSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    datetime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    eventType: {
      type: String,
      enum: Object.values(eventTypes),
      default: "everyone",
    },
    description: {
      type: String,
      required: true,
      unique: false,
    },
    allDay:{
      type: Boolean,
      required:false,
    }
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
