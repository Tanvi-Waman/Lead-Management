const ActivityLog = require("../models/ActivityLog");

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
