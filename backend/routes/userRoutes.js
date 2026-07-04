const User = require("../models/User");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/", auth, roleMiddleware("superadmin"), createUser);
router.get("/", auth, roleMiddleware("superadmin"), getAllUsers);
router.get("/:id", auth, roleMiddleware("superadmin"), getUserById);
router.put("/:id", auth, roleMiddleware("superadmin"), updateUser);
router.delete("/:id", auth, roleMiddleware("superadmin"), deleteUser);

module.exports = router;
