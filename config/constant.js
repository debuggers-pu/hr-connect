const userRole = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

const status = Object.freeze({
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
});

const leaveType = Object.freeze({
  SICK: "sick",
  CASUAL: "casual",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  ANNUAL: "annual",
});
const attendanceType = Object.freeze({
  PRESENT: "present",
  ABSENT: "absent",
  LEAVE: "leave",
});

const location = Object.freeze({
  OFFICE: "office",
  HOME: "home",
  OTHER: "other",
});

const eventTypes = Object.freeze({
  PRIVATE: "private",
  PUBLIC: "public",
});

module.exports = {
  userRole,
  status,
  leaveType,
  attendanceType,
  location,
  eventTypes,
};
