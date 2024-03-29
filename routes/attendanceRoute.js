const express = require("express");

const {
  clockIn,
  clockOut,
  getAllAttendance,
  getAllAttendanceByDate,
  getWorkload,
  getWorkloadOfSingleEmployee,
  getTotalAttendanceToday
} = require("../controller/attendanceController");

const { isLoggedIn } = require("../middleware/auth");

const attendanceRoute = express.Router();

attendanceRoute.post("/clockIn", isLoggedIn, clockIn);
attendanceRoute.post("/clockOut", isLoggedIn, clockOut);
attendanceRoute.get("/getAllAttendance", isLoggedIn, getAllAttendance);
attendanceRoute.get("/getAllAttendanceByDate/:date", isLoggedIn, getAllAttendanceByDate);
attendanceRoute.get("/getWorkload/:date", isLoggedIn, getWorkload);
attendanceRoute.get(
  "/getWorkloadOfSingleEmployee/:date/:userId",
  isLoggedIn,
  getWorkloadOfSingleEmployee
);
attendanceRoute.get("/getTotalAttendanceToday", isLoggedIn, getTotalAttendanceToday);

module.exports = attendanceRoute;
