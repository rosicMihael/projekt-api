const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  hourlyPay: { type: String, required: true },
  earnings: { type: Number, required: true },
});

const TimesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  dailyLogs: [dailyLogSchema],
});

module.exports = mongoose.model("Timesheet", TimesheetSchema);
