const Attendance = require("../model/attendance.js");
const wifi = require("node-wifi");

// Create Attendance

const createAttendance = async (req, res) => {
  try {
    wifi.init({
      iface: null,
    });
    wifi.getCurrentConnections((err, currentConnections) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "Some error occurred while getting wifi connection.",
        });
      } else {
        const collegeWifiNames = [
          "404 NOT FOUND ERROR__5",
          "404 NOT FOUND ERROR__2.4",
          "NTFiber-CEA0",
          "suamn30_fpkhr",
        ];

        const connectedToCollegeWifi = currentConnections.find((connection) =>
          collegeWifiNames.includes(connection.ssid)
        );
        if (connectedToCollegeWifi) {
          const { date, location } = req.body;
          const user = req.user;
          const employeeName = user.name;
          const attendance = new Attendance({
            employeeName,
            date,
            location,
          });

          Attendance.findOne({
            employeeName: employeeName,
            date: date,
          })
            .then((existingAttendance) => {
              if (existingAttendance) {
                return res.status(400).json({
                  error: "Attendance already exists for the specified date",
                });
              }
              // Save Attendance in the database
              attendance
                .save()
                .then((data) => {
                  res.send({
                    message: "Attendance created successfully",
                    data,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while making the Attendance.",
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while checking existing Attendance.",
              });
            });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Attendance failed!" });
  }
};

module.exports = {
  createAttendance,
};
