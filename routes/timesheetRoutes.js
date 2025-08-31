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

router.route("/:timesheetId/logs").get(timesheetController.getDailyLogs);
router.route("/:timesheetId/logs/new").post(timesheetController.addNewDailyLog);

module.exports = router;
