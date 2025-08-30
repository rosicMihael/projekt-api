const Timesheet = require("../models/Timesheet");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all work logs for a user
// @route GET /timesheet
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

// @desc Add a new timesheet
// @route POST /timesheet
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

  const newTimesheet = Timesheet.create(timesheetObject);

  if (newTimesheet) {
    res
      .status(201)
      .json({ message: `New timesheet for ${user.username} created!` });
  } else {
    res.status(400).json({ message: "Invalid timesheet data received!" });
  }
});

// @desc delete a timesheet
// @route DELETE /timesheet
// @access Private

const deleteTimesheet = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //confirm data
  if (!id) {
    return res.status(400).json({ message: "All fields required!" });
  }

  //check if note exists
  const timesheet = await Timesheet.findByIdAndDelete(id);

  if (!timesheet) {
    return res.status(400).json({ message: "Timesheet not found!" });
  }

  const reply = `Timesheet with ID ${timesheet._id} deleted!`;

  res.json(reply);
});

module.exports = { getTimesheets, addNewTimesheet, deleteTimesheet };
