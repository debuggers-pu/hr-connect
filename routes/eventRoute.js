const express = require("express");

const { createEvent } = require("../controller/eventController");

const { isLoggedIn } = require("../middleware/auth");

const eventRoute = express.Router();

eventRoute.post("/createEvent", isLoggedIn, createEvent);

module.exports = eventRoute;
