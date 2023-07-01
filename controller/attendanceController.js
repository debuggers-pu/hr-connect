const Attendance = require("../model/attendance.js");

// Create attendance
const createAttendance = async (req, res) => {
  try {
    const { employeeName, attendanceType, date, status, reason } = req.body;
    const attendance = new Attendance({
      employeeName,
      attendanceType,
      date,
      status,
      reason,
    });
    // // create attendance ONLY WITH SPECIFIC WIFI MAC ADDRESS (for now)
    // if (req.body.macAddress !== "00:00:00:00:00:00") {
    //   return res.status(400).json({ error: "Invalid MAC Address" });
    // }

    //check wifi ip address lies within the range of the college's wifi ip address
    if (
      !["192.168.1.119", "192.168.1.120", "192.168.1.121"].includes(
        req.body.wifiIpAddress
      )
    ) {
      const wifiIpAddress = req.body.wifiIpAddress;
      const collegeWifiIpAddresses = [
        "192.168.1.119",
        "192.168.1.123",
        "192.168.1.124",
      ];
      if (!collegeWifiIpAddresses.includes(wifiIpAddress)) {
        return res.status(400).json({ error: "Invalid Wifi IP Address" });
      }
    }

    const existingAttendance = await Attendance.findOne({
      employeeName: employeeName,
      date: date,
    });
    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: "Attendance already exists for the specified date" });
    }

    const newAttendance = await attendance.save();
    res
      .status(200)
      .json({ message: "Attendance created successfully", newAttendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating attendance" });
  }
};

module.exports = {
  createAttendance,
};
