const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "HRConnect",
    description: "Description",
  },
  host: "localhost:5000",
  schemes: ["http"],
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
