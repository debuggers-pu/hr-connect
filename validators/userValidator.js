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

  (req, res, next) => {
    validateReq(req, res, next);
  },
];

module.exports = { validateRegisterUser };