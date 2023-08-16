const express = require("express");

const {
  adminLogin,
  onlyAdmin,
  updateUserType,
  updateLeaveStatus,
  getLeaveNotificationsForUser,
  removeNotification,
} = require("../controller/adminController");

const { isLoggedIn, isAdmin } = require("../middleware/auth");
const { validateLoginUser } = require("../validators/userValidator");
const adminRouter = express.Router();

adminRouter.post("/admin-login", validateLoginUser, adminLogin);
adminRouter.get("/only-admin", isLoggedIn, isAdmin, onlyAdmin);
adminRouter.patch("/update-user-type/:id", isLoggedIn, isAdmin, updateUserType);
adminRouter.patch(
  "/update-leave-status/:id",
  isLoggedIn,
  isAdmin,
  updateLeaveStatus
);
adminRouter.get(
  "/get-leave-notifications-for-user",
  isLoggedIn,
  isAdmin,
  getLeaveNotificationsForUser
);

adminRouter.delete(
  "/remove-notification/:id",
  isLoggedIn,
  isAdmin,
  removeNotification
);

module.exports = adminRouter;
