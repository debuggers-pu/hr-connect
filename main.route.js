const routes = require("express").Router();

const userRoute = require("./routes/userRoute");
const leaveRoute = require("./routes/leaveRoute");
const attendanceRoute = require("./routes/attendanceRoute");

routes.use("/user", userRoute);
routes.use("/leave", leaveRoute);
routes.use("/attendance", attendanceRoute);

module.exports = routes;
