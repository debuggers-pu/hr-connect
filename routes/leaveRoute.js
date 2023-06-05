const express = require("express");

const {
  createLeave,
  updateLeave,
  deleteLeave,
  getAllLeaves,
  getLeaveById,
} = require("../controller/leaveController");

const { isLoggedIn } = require("../middleware/auth");

const leaveRoute = express.Router();

leaveRoute.post("/create-leave", isLoggedIn, createLeave);
leaveRoute.patch("/update-leave/:id", isLoggedIn, updateLeave);
leaveRoute.delete("/delete-leave/:id", isLoggedIn, deleteLeave);
leaveRoute.get("/get-leave-by-id/:id", isLoggedIn, getLeaveById);
leaveRoute.get("/get-all-leaves", isLoggedIn, getAllLeaves);

module.exports = leaveRoute;
