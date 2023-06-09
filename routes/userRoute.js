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
} = require("../controller/userController");
const {
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateUpdateUser,
} = require("../validators/userValidator");
const { isLoggedIn } = require("../middleware/auth");

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

module.exports = userRoute;
