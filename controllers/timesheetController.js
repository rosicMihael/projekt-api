const Timesheet = require("../models/Timesheet");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all timesheets
// @route GET /timesheets
// @access Private
const getTimesheets = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find().lean();
  if (!timesheets?.length) {
    return res.status(400).json({ message: "No timesheets found!" });
  }
  const timesheetsWithUser = await Promise.all(
    timesheets.map(async (timesheet) => {
      const user = await User.findById(timesheet.user).lean().exec();
      return { ...timesheet, username: user.username };
    })
  );
  res.json(timesheetsWithUser);
});

// @desc Get all daily logs from a timesheet
// @route GET /timesheets/:timesheetId/logs
// @access Private
const getDailyLogs = asyncHandler(async (req, res) => {
  const { timesheetId } = req.params;
  const timesheet = await Timesheet.findById(timesheetId).lean();
  if (!timesheet) {
    return res.status(404).json({ message: "Timesheet does not exist!" });
  }
  const logs = timesheet.dailyLogs;
  res.json(logs || []);
});

// @desc Add a new timesheet
// @route POST /timesheets
// @access Private
const addNewTimesheet = asyncHandler(async (req, res) => {
  const { user, year, month } = req.body;

  // Confirm data
  if (!user || !year || !month) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const timesheetObject = {
    user,
    year,
    month,
    dailyLogs: [],
  };

  const newTimesheet = await Timesheet.create(timesheetObject);

  if (newTimesheet) {
    res.status(201).json({ message: `New timesheet created!` });
  } else {
    res.status(400).json({ message: "Invalid timesheet data received!" });
  }
});

// @desc Add a new daily log
// @route POST /timesheets/:timesheetId/logs/new
// @access Private
const addNewDailyLog = asyncHandler(async (req, res) => {
  const { timesheetId } = req.params;
  const { from, to, hourlyPay, date } = req.body;

  function formatDate(dateString) {
    const [, month, day] = dateString.split("-");
    return `${day}.${month}`;
  }

  function formatHour(hourString) {
    const [hour, minutes] = hourString.split(":");
    const hourNum = parseInt(hour);
    const minutesNum = parseInt(minutes) / 60;
    return hourNum + minutesNum;
  }

  // Confirm data
  if (from === null || to === null || hourlyPay === null || date === null) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // calculate earnings
  const hoursWorked = formatHour(to) - formatHour(from);
  const numHourlyPay = parseInt(hourlyPay);
  const earnings = hoursWorked * numHourlyPay;

  const formatedDate = formatDate(date);

  const timesheet = await Timesheet.findById(timesheetId);
  if (!timesheet) {
    return res.status(404).json({ message: "Timesheet not found!" });
  }

  // Push new daily log
  timesheet.dailyLogs.push({
    date: formatedDate,
    from,
    to,
    hourlyPay,
    earnings,
  });

  const updatedTimesheet = await timesheet.save();

  if (updatedTimesheet) {
    res.status(201).json({
      message: `Daily log added to timesheet with ID ${timesheetId} successfully!`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received!" });
  }
});

/*
// @desc update a daily log
// @route PATCH /timesheets/:timeseetId/dailyLog/:dailyLogId
// @access Private

const updateDailyLog = asyncHandler(async (req, res) => {
  const { timesheetId, dailyLogId } = req.params;
  const { day, from, to, hourlyPay } = req.body;

  // Confirm data
  if (day == null || from == null || to == null || hourlyPay == null) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Find parent timesheet
  const timesheet = await Timesheet.findById(timesheetId);
  if (!timesheet) {
    return res.status(404).json({ message: "Timesheet not found!" });
  }

  // Find the daily log
  const log = timesheet.dailyLogs.id(dailyLogId); // Mongoose subdocument
  if (!log) {
    return res.status(404).json({ message: "Daily log not found!" });
  }

  // Update fields
  log.day = day;
  log.from = from;
  log.to = to;
  log.hourlyPay = hourlyPay;
  log.earnings = (to - from) * hourlyPay; // recalc earnings

  // Save parent timesheet
  await timesheet.save();

  res.json({ message: "Daily log updated successfully!", dailyLog: log });
});

*/

// @desc delete a timesheet
// @route DELETE /timesheets/:timesheetId
// @access Private

const deleteTimesheet = asyncHandler(async (req, res) => {
  const { timesheetId } = req.params;

  const timesheet = await Timesheet.findByIdAndDelete(timesheetId);

  if (!timesheet) {
    return res.status(400).json({ message: "Timesheet not found!" });
  }

  const reply = `Timesheet with ID ${timesheet._id} deleted!`;

  res.json(reply);
});

module.exports = {
  getTimesheets,
  addNewTimesheet,
  deleteTimesheet,
  getDailyLogs,
  addNewDailyLog,
};
