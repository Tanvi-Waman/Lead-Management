const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  addTagToLead,
  removeTagFromLead,
  searchLead,
  filterLead,
  importLeads,
  exportLeads,
} = require("../controllers/leadController");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  createLead,
);
router.get("/", authMiddleware, getAllLeads);
router.get("/search", authMiddleware, searchLead);
router.get("/filter", authMiddleware, filterLead);
router.get(
  "/export",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  exportLeads,
);
router.get("/:id", authMiddleware, getLeadById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  updateLead,
);
router.delete("/:id", authMiddleware, roleMiddleware("superadmin"), deleteLead);
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  assignLead,
);
router.patch(
  "/:id/tag",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  addTagToLead,
);

router.delete(
  "/:id/tag/:tagId",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  removeTagFromLead,
);

router.post(
  "/import",
  authMiddleware,
  roleMiddleware("superadmin", "subadmin"),
  upload.single("file"),
  importLeads,
);

module.exports = router;
