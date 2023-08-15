const express = require("express");


const  {
  adminLogin,
  onlyAdmin,
  updateUserType,
  updateLeaveStatus,
} = require("../controller/adminController");

const { isLoggedIn, isAdmin } = require("../middleware/auth");
const { validateLoginUser } = require("../validators/userValidator");
const adminRouter = express.Router();

adminRouter.post("/admin-login",validateLoginUser, adminLogin);
adminRouter.get("/only-admin", isLoggedIn, isAdmin, onlyAdmin);
adminRouter.patch("/update-user-type/:id", isLoggedIn, isAdmin, updateUserType);
adminRouter.patch("/update-leave-status/:id", isLoggedIn, isAdmin, updateLeaveStatus);

module.exports = adminRouter;




