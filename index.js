const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/dbconfig");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const corsOption = {
  origin: ["https://localhost:5173"],
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOption.origin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.json({});
  }
  next();
});

// Routes
const userRoute = require("./routes/userRoute");
const leaveRoute = require("./routes/leaveRoute");

app.use("/hrConnect/api/user", userRoute);
app.use("/hrConnect/api/leave", leaveRoute);

const port = process.env.Port || 5000;
if (process.env.NODE_ENV !== "test")
  app.listen(port, () => console.log(`Node server started at port ${port}`));

module.exports = { app };
