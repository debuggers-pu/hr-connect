const express = require("express");

const {
  createAttendance,
  clockOutAttendance,
  getAllAttendance,
} = require("../controller/attendanceController");

const { isLoggedIn } = require("../middleware/auth");

const attendanceRoute = express.Router();

attendanceRoute.post("/createAttendance", isLoggedIn, createAttendance);
attendanceRoute.patch("/clockOutAttendance", isLoggedIn, clockOutAttendance);
attendanceRoute.get("/getAllAttendance", isLoggedIn, getAllAttendance);

module.exports = attendanceRoute;
