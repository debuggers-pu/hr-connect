const mongoose = require("mongoose");

const { userRole } = require("../config/constant");

const notifcationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title:{
    type : String
  },
  message: String
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      min: 2,
    },
    username: {
      type: String,
      unique: true,
      min: 4,
    },
    email: {
      type: String,
      unique: true,
      requied: true,
      lowecase: true,
    },
    avatar: {
      type: String,
    },
    userType: {
      type: String,
      enum: Object.values(userRole),
      default: "user",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiration: {
      type: Date,
      default: null,
    },
    phoneNumber: {
      type: String,
      min: 8,
    },
    
    location: {
      type: String,
    },
    notification: {
      type: [notifcationSchema]
    }
    
  },
  {
    timestamps: true,
    id: true,
  }
);

module.exports = mongoose.model("User", userSchema);
