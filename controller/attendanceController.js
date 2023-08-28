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
          "blacktech1_fpkhr_5g",
          "blacktech1_fpkhr_2.4",
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

// clockoutAttendance
const clockOutAttendance = async (req, res) => {
  try {
    const user = req.user;
    const employeeName = user.name;
    const currentDate = new Date();

    const existingAttendance = await Attendance.findOne({
      employeeName: employeeName,
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
      },
    });

    if (!existingAttendance) {
      return res.status(400).json({
        error:
          "Attendance not found for today. You must create attendance first.",
      });
    }

    if (existingAttendance.clockOutTime) {
      return res.status(400).json({
        error: "Attendance has already been clocked out for today.",
      });
    }

    existingAttendance.clockOutTime = currentDate;
    await existingAttendance.save();
    console.log("Attendance clocked out successfully.", existingAttendance);
    return res.json({
      message: "Attendance clocked out successfully.",
      data: existingAttendance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Clock-out failed!" });
  }
};

const schedule = require("node-schedule");
const automaticClockOutRule = new schedule.RecurrenceRule();
automaticClockOutRule.hour = 0;
automaticClockOutRule.minute = 0;

const automaticClockOutJob = schedule.scheduleJob(
  automaticClockOutRule,
  async () => {
    try {
      const pastMidnight = new Date(); 
      pastMidnight.setHours(0, 0, 0, 0); 

      const overdueAttendances = await Attendance.find({
        clockOutTime: { $exists: false },
        date: { $lt: pastMidnight },
      });

      for (const attendance of overdueAttendances) {
        attendance.clockOutTime = pastMidnight;
        await attendance.save();
        console.log("Auto clock-out for:", attendance);
      }
    } catch (error) {
      console.error("Automatic clock-out task failed:", error);
    }
  }
);


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

// get all attendance by date

const getAllAttendanceByDate = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      date: req.params.date,
    });
    res.send(attendance);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving attendance.",
    });
  }
};


module.exports = {
  createAttendance,
  clockOutAttendance,
  getAllAttendance,
  getAllAttendanceByDate,
};
