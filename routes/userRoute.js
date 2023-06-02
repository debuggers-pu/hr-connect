const express = require("express");
const upload = require("../helper/multer");


const {registerUser,emailVerify } = require("../controller/userController");
const {validateRegisterUser} = require("../validators/userValidator");

const userRoute = express.Router();  

userRoute.post("/register", upload.single("avatar"), validateRegisterUser, registerUser);
userRoute.get("/emailVerify", emailVerify);

module.exports = userRoute;