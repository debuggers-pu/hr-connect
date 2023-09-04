const Attendance = require("../model/attendance.js");
const wifi = require("node-wifi");
const cron = require("node-cron");
const moment = require("moment-timezone");

// Create Attendance
const clockIn = async (req, res) => {
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
          "blacktech1_fpkhr_5g",
          "blacktech1_fpkhr_2.4",
          "BlackTech_5",
        ];

        const connectedToCollegeWifi = currentConnections.find((connection) =>
          collegeWifiNames.includes(connection.ssid)
        );
        if (!connectedToCollegeWifi) {
          return res.status(400).json({
            error: "You are not connected to college wifi",
          });
        }
        if (connectedToCollegeWifi) {
          const { date, startTime, location } = req.body;
          const user = req.user;
          const employeeName = user.name;
          const currentDate = moment().tz("Asia/Kathmandu").format("YYYY-MM-DD");
          const inputDate = moment(date).format("YYYY-MM-DD");

          const timeDiff = moment(currentDate).diff(moment(inputDate), "days");
          const daysDiff = parseInt(timeDiff);

          // cannot clock-in for future dates
          if (daysDiff < 0) {
            return res.status(400).json({
              error: "Cannot clock-in for future dates",
            });
          }else if (daysDiff > 0) {
            return res.status(400).json({
              error: "Cannot clock-in for past dates",
            });
          }

          const time = moment().tz("Asia/Kathmandu").format("hh:mm A");

          const attendance = new Attendance({
            employeeName,
            date,
            startTime: time,
            location,
          });
          Attendance.findOne({
            employeeName: employeeName,
            date,
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
                    message: "Clock-in successful",
                    data,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while making the clock-in entry",
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
    return res.status(500).json({ error: "Clock-in failed!" });
  }
};

// clockoutAttendance
const clockOut = async (req, res) => {
  try {
    wifi.init({
      iface: null,
    });
    wifi.getCurrentConnections((err, currentConnections) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Some error occurred while getting wifi connection.",
        });
      }

      const collegeWifiNames = [
        "404 NOT FOUND ERROR__5",
        "404 NOT FOUND ERROR__2.4",
        "NTFiber-CEA0",
        "suamn30_fpkhr",
        "blacktech1_fpkhr_5g",
        "blacktech1_fpkhr_2.4",
        "BlackTech_5",
      ];

      const connectedToCollegeWifi = currentConnections.find((connection) =>
        collegeWifiNames.includes(connection.ssid)
      );

      if (!connectedToCollegeWifi) {
        return res.status(400).json({
          error: "You are not connected to college wifi",
        });
      }

      if (connectedToCollegeWifi) {
        const user = req.user;
        const employeeName = user.name;

        const endTime = moment().tz("Asia/Kathmandu").format("hh:mm A");

        Attendance.findOneAndUpdate(
          {
            employeeName: employeeName,
            endTime: null,
          },
          { $set: { endTime: endTime } },
          { new: true }
        )
          .then((data) => {
            if (!data) {
              return res.status(400).json({
                error:
                  "No clock-in record found for today or clock-out already recorded",
              });
            }
            res.send({
              message: "Clock-out successful",
              data,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while updating the clock-out entry",
            });
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Clock-out failed!" });
  }
};



// autoClockOut after 12 am
const autoClockOut = async () => {
  try {
    const currentDate = new Date();
    // set time to midnight
    currentDate.setHours(0, 0, 0, 0);

    const unclosedAttendances = await Attendance.find({
      endTime: { $exists: false },
      startTime: { $lt: currentDate },
    });
    for (const attendance of unclosedAttendances) {
      attendance.endTime = currentDate;
      await attendance.save();
    }
  } catch (error) {
    console.log("error in autoClockOut", error);
  }
};

cron.schedule("0 0 0 * * *", autoClockOut);

// get all attendance

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.send(attendance);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving attendance.",
    });
  }
};

// get all attendance by start time and end time for specific date
const getAllAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendanceRecords = await Attendance.find({ date });
    const clockedInUsers = attendanceRecords.filter(
      (record) => record.startTime && !record.endTime
    );
    const clockedOutUsers = attendanceRecords.filter(
      (record) => record.endTime
    );

    res.send({
      date,
      clockedInUsers,
      clockedOutUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error while retrieving attendance records." });
  }
};


// get total workload of employee according to clock in and clock out time and calculate total workload of employee in hours
const getWorkload = async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRecords = await Attendance.find({ date });
    const clockedInUsers = attendanceRecords.filter(
      (record) => record.startTime && !record.endTime
    );
    const clockedOutUsers = attendanceRecords.filter(
      (record) => record.endTime
    );

    const workload = clockedInUsers.map((clockedInUser) => {
      const clockedOutUser = clockedOutUsers.find(
        (clockedOutUser) =>
          clockedOutUser.employeeName === clockedInUser.employeeName
      );
      const startTime = moment(clockedInUser.startTime, "hh:mm A");
      const endTime = moment(clockedOutUser.endTime, "hh:mm A");
      const duration = moment.duration(endTime.diff(startTime));
      const hours = parseInt(duration.asHours());
      const minutes = parseInt(duration.asMinutes()) % 60;
      const workload = `${hours} hours ${minutes} minutes`;
      return {
        message: "Workload for the specified date",
        employeeName: clockedInUser.employeeName,
        startTime: clockedInUser.startTime,
        endTime: clockedOutUser.endTime,
        workload,
      };
    });

    res.send({
      message: "Workload for the specified date",
      date,
      workload,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error while retrieving attendance records." });
  }
};


module.exports = {
  clockIn,
  clockOut,
  getAllAttendance,
  getAllAttendanceByDate,
  getWorkload,
};
