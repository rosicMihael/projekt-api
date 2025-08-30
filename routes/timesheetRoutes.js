const express = require("express");
const router = express.Router();
const timesheetController = require("../controllers/timesheetController");
const verifyJWT = require("../middleware/verifyJWT");

//router.use(verifyJWT);

router
  .route("/")
  .get(timesheetController.getTimesheets)
  .post(timesheetController.addNewTimesheet);

router.route("/:timesheetId").delete(timesheetController.deleteTimesheet);

router
  .route("/:timesheetId/dailyLogs")
  .get(timesheetController.getDailyLogs)
  .post(timesheetController.addNewDailyLog);

router
  .route("/:timesheetId/dailyLogs/:dailyLogId")
  .patch(timesheetController.updateDailyLog);

module.exports = router;
