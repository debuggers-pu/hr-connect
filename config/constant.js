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

module.exports = {
  userRole,
  status,
  leaveType,
};
