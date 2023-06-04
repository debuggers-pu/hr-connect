const express = require("express");
const upload = require("../helper/multer");


const {registerUser,emailVerify, loginUser, forgotPassword, resetPassword } = require("../controller/userController");
const {validateRegisterUser, validateLoginUser, validateResetPassword} = require("../validators/userValidator");

const userRoute = express.Router();  

userRoute.post("/register", upload.single("avatar"), validateRegisterUser, registerUser);
userRoute.get("/emailVerify", emailVerify);
userRoute.post("/login",validateLoginUser, loginUser);
userRoute.post("/forgot-password", forgotPassword);
userRoute.post("/reset-password", validateResetPassword, resetPassword);

module.exports = userRoute;