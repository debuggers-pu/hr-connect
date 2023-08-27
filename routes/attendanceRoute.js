const express = require("express");

const {
  createAttendance,
  clockOutAttendance,
} = require("../controller/attendanceController");

const { isLoggedIn } = require("../middleware/auth");

const attendanceRoute = express.Router();

attendanceRoute.post("/createAttendance", isLoggedIn, createAttendance);
attendanceRoute.patch("/clockOutAttendance", isLoggedIn, clockOutAttendance);

module.exports = attendanceRoute;
