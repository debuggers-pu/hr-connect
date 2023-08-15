const routes = require("express").Router();

const userRoute = require("./routes/userRoute");
const leaveRoute = require("./routes/leaveRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const cvRoute = require("./routes/cvRoute");
const adminRoute = require("./routes/adminRoute");

routes.use("/user", userRoute);
routes.use("/leave", leaveRoute);
routes.use("/attendance", attendanceRoute);
routes.use("/admin", adminRoute);
routes.use("/cv", cvRoute);

module.exports = routes;
