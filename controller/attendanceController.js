const Attendance = require("../model/attendance.js");
const wifi = require("node-wifi");
const cron = require("node-cron");

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
          "BlackTech_5"
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
          const { startTime, location } = req.body;
          const user = req.user;
          const employeeName = user.name;
          const attendance = new Attendance({
            employeeName,
            startTime: new Date(),
            location,
          });

          const attendanceDate = new Date(startTime);
          attendanceDate.setHours(0, 0, 0, 0); // Set time to midnight

          Attendance.findOne({
            employeeName: employeeName,
            startTime: {
              $gte: attendanceDate,
              $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000), // Next day
            },
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
    const user = req.user;
    const employeeName = user.name;
    const attendance = await Attendance.findOneAndUpdate({
      employeeName: employeeName,
      endTime: {$exists: false}
    },
    {
      endTime: new Date()
    },
    {
      new: true
    }
    );
    if (!attendance) {
      return res.status(400).json({
        error: "Attendance not found",
      });
    }
    attendance.endTime = new Date();
    await attendance.save();
    res.send({
      message: "Clock-out successful",
      attendance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Clock-out failed!" }); 
  }
};


// autoClockOut after 12 am
const autoClockOut = async () => {
  try{
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

  }
  catch(error){
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

// get all attendance by start date and end date 

const getAllAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    const attendance = await Attendance.find({
      startTime: {
        $gte: startDate,
        $lt: endDate,
      },
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
  clockIn,
  clockOut,
  getAllAttendance,
  getAllAttendanceByDate,
};
