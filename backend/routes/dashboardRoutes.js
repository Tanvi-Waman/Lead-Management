const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getDashboard } = require("../controllers/dashboardController");

router.get("/", auth, roleMiddleware("superadmin", "subadmin"), getDashboard);

module.exports = router;
