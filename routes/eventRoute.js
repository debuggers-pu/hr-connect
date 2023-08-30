const express = require("express");

const { createEvent, updateEvent } = require("../controller/eventController");

const { isLoggedIn } = require("../middleware/auth");

const eventRoute = express.Router();

eventRoute.post("/createEvent", isLoggedIn, createEvent);
eventRoute.patch("/updateEvent/:id", isLoggedIn, updateEvent);

module.exports = eventRoute;
