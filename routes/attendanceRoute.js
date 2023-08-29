const express = require("express");

const {
  clockIn,
  clockOut,
  getAllAttendance,
  getAllAttendanceByDate
} = require("../controller/attendanceController");

const { isLoggedIn } = require("../middleware/auth");

const attendanceRoute = express.Router();

attendanceRoute.post("/clockIn", isLoggedIn, clockIn);
attendanceRoute.post("/clockOut", isLoggedIn, clockOut);
attendanceRoute.get("/getAllAttendance", isLoggedIn, getAllAttendance);
attendanceRoute.get("/getAllAttendanceByDate/:date", isLoggedIn, getAllAttendanceByDate);

module.exports = attendanceRoute;
