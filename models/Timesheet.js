const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  from: { type: String, required: true }, // Started working
  to: { type: String, required: true }, // Finished working
  hourlyPay: { type: String, required: true }, // Hourly rate
  earnings: { type: Number, required: true }, // Calculated: hours * hourlyPay
});

const TimesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true, min: 1, max: 12 }, // 1 = January, 12 = December
  dailyLogs: [dailyLogSchema], // Array of daily entries
});

module.exports = mongoose.model("Timesheet", TimesheetSchema);
