const express = require("express");
const router = express.Router();
const timesheetController = require("../controllers/timesheetController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(timesheetController.getTimesheets)
  .post(timesheetController.addNewTimesheet)
  .delete(timesheetController.deleteTimesheet);

module.exports = router;
