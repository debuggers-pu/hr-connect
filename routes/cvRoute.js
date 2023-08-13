const express = require("express");
const upload = require("../helper/multer");

const { createCv } = require("../controller/cvController");

const { isLoggedIn } = require("../middleware/auth");

const cvRoute = express.Router();

cvRoute.post("/create-cv", isLoggedIn, upload.single("cv"), createCv);

module.exports = cvRoute;
