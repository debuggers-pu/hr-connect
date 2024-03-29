const { body } = require("express-validator");
const validateReq = require("../helper/validationHelper");
const validateRegisterUser = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required1")
    .isLength({ min: 2 })
    .withMessage("Name should be more than 2 characters"),

  body("email").isEmail().withMessage("Please enter valid email"),

  body("username")
    .isLength({ min: 4 })
    .withMessage("Username should more than 4 char")
    .optional(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be greater than 6 characters"),
  
  body("phoneNumber")
    .isLength({ min: 8 })
    .withMessage("Phone number must be greater than 8 characters")
    .optional(),
    
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .optional(),


  (req, res, next) => {
    validateReq(req, res, next);
  },
];

const validateUpdateUser = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required1")
    .isLength({ min: 2 })
    .withMessage("Name should be more than 2 characters")
    .optional(),

  body("email").isEmail().withMessage("Please enter valid email").optional(),

  body("username")
    .isLength({ min: 4 })
    .withMessage("Username should more than 4 char")
    .optional(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be greater than 6 characters")
    .optional(),

  body("phoneNumber")
    .isLength({ min: 8 })
    .withMessage("Phone number must be greater than 8 characters")
    .optional(),
    
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .optional(),
      

  (req, res, next) => {
    validateReq(req, res, next);
  },
];

const validateLoginUser = [
  body("email").isEmail().withMessage("Invalid Email"),

  body("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    validateReq(req, res, next);
  },
];

const validateResetPassword = [
  body("email").isEmail().withMessage("Invalid email"),
  body("otp").notEmpty().withMessage("Enter otp"),
  body("newPassword").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    validateReq(req, res, next);
  },
];

const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword").notEmpty().withMessage("New password is required"),

  (req, res, next) => {
    validateReq(req, res, next);
  }
];

module.exports = {
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateUpdateUser,
  validateChangePassword
};
