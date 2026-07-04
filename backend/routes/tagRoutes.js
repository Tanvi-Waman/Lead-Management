const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

router.post("/", auth, roleMiddleware("superadmin", "subadmin"), createTag);

router.get("/", auth, getAllTags);

router.put("/:id", auth, roleMiddleware("superadmin", "subadmin"), updateTag);

router.delete("/:id", auth, roleMiddleware("superadmin"), deleteTag);

module.exports = router;
