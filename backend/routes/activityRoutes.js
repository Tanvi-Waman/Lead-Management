const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getAllActivities } = require("../controllers/activityController");

router.get("/", auth, roleMiddleware("superadmin"), getAllActivities);

module.exports = router;
