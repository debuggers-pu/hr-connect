const express = require("express");

const { createAttendance } = require("../controller/attendanceController");

const { isLoggedIn } = require("../middleware/auth");

const attendanceRoute = express.Router();

attendanceRoute.post("/createAttendance", isLoggedIn, createAttendance);

module.exports = attendanceRoute;
