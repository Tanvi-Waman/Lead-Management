const Lead = require("../models/Lead");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({
      status: "new",
    });
    const contracted = await Lead.countDocuments({
      status: "contracted",
    });
    const qualified = await Lead.countDocuments({
      status: "qualified",
    });
    const won = await Lead.countDocuments({
      status: "won",
    });
    const lost = await Lead.countDocuments({
      status: "lost",
    });

    const totalAgents = await Lead.countDocuments({
      role: "supportagent",
    });

    const agentPerformance = await User.find({
      role: "supportagent",
    });

    const performance = [];
    for (let i = 0; i < agentPerformance.length; i++) {
      const leadCount = await Lead.countDocuments({
        assignedTo: agentPerformance[i]._id,
      });

      performance.push({
        name: agentPerformance[i].name,
        totalAssigned: leadCount,
      });
    }

    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalLeads,
      newLeads,
      contracted,
      qualified,
      won,
      lost,
      totalAgents,
      performance,
      recentLeads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
