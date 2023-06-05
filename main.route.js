const routes = require("express").Router();

const userRoute = require("./routes/userRoute");
const leaveRoute = require("./routes/leaveRoute");

routes.use("/user", userRoute);
routes.use("/leave", leaveRoute);

module.exports = routes;
