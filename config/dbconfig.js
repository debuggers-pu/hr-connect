const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDb connected successfully");
});

connection.on("error", (error) => {
  console.log("Error in MongoDb connection", error);
});

module.exports = mongoose;
