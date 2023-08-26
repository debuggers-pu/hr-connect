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
        const collegeWifi = "404 NOT FOUND ERROR__2.4";
        const connectedToCollegeWifi = currentConnections.find(
          (connection) => connection.ssid === collegeWifi
        );
        if (connectedToCollegeWifi) {
          const { employeeName, attendanceType, date, status, reason } =
            req.body;
          const attendance = new Attendance({
            employeeName,
            attendanceType,
            date,
            status,
            reason,
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
