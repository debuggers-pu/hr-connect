const express = require("express");

const {
  createLeave,
  updateLeave,
  deleteLeave,
  getAllLeaves,
  getLeaveById,
  getLeavesByUser,
  getLeaveNotifications,
  removeNotification,
  getTotalLeavesToday
} = require("../controller/leaveController");

const { isLoggedIn, isAdmin } = require("../middleware/auth");

const leaveRoute = express.Router();

leaveRoute.post("/create-leave", isLoggedIn, createLeave);
leaveRoute.patch("/update-leave/:id", isLoggedIn, updateLeave);
leaveRoute.delete("/delete-leave/:id", isLoggedIn, deleteLeave);
leaveRoute.get("/get-leave-by-id/:id", isLoggedIn, getLeaveById);
leaveRoute.get("/get-all-leaves", isLoggedIn, getAllLeaves);
leaveRoute.get("/get-leaves-by-user", isLoggedIn, getLeavesByUser);
leaveRoute.get("/get-leave-notifications", isLoggedIn,isAdmin,getLeaveNotifications);
leaveRoute.delete("/remove-notification/:id", isLoggedIn,isAdmin,removeNotification);
leaveRoute.get("/getTotalLeavesToday", isLoggedIn, getTotalLeavesToday);

module.exports = leaveRoute;
