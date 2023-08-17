const express = require("express");
const upload = require("../helper/multer");

const {
  registerUser,
  emailVerify,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserProfileById,
  deleteUser,
  getUserById,
  changePassword,
  getAllUsers,
  getUserId,
} = require("../controller/userController");
const {
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateUpdateUser,
  validateChangePassword,
} = require("../validators/userValidator");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const userRoute = express.Router();

userRoute.post(
  "/register",
  upload.single("avatar"),
  validateRegisterUser,
  registerUser
);
userRoute.get("/emailVerify", emailVerify);
userRoute.post("/login", validateLoginUser, loginUser);
userRoute.post("/forgot-password", forgotPassword);
userRoute.post("/reset-password", validateResetPassword, resetPassword);
userRoute.patch(
  "/update-user",
  isLoggedIn,
  upload.single("avatar"),
  validateUpdateUser,
  updateUserProfileById
);
userRoute.delete("/delete-user", isLoggedIn, deleteUser);
userRoute.get("/get-user-by-id", isLoggedIn, getUserById);
userRoute.patch(
  "/change-password/:id",
  isLoggedIn,
  validateChangePassword,
  changePassword
);
userRoute.get("/get-all-users", isLoggedIn, isAdmin, getAllUsers);
userRoute.get("/getUserById/:id", isLoggedIn, isAdmin, getUserId);

module.exports = userRoute;
