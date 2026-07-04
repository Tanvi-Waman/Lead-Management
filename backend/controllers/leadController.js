const Lead = require("../models/Lead");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;
    const lead = new Lead({
      name,
      email,
      phone,
      source,
      status,
    });
    await lead.save();
    await ActivityLog.create({
      user: req.user.id,
      action: "Create Lead",
      details: "Created lead " + lead.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    let leads;
    if (req.user.role === "supportagent") {
      leads = await Lead.find({
        assignedTo: req.user.id,
      })
        .populate("assignedTo", "name email")
        .populate("tags", "tagName");
    } else {
      leads = await Lead.find()
        .populate("assignedTo", "name email")
        .populate("tags", "tagName");
    }
    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("tags", "tagName");
    if (!lead) {
      return res.status(404).json({
        message: "Lead Not Found",
      });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        source,
        status,
      },
      {
        new: true,
      },
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "Update Lead",
      details: "Updated lead " + lead.name,
    });

    res.json({
      message: "Lead Updated Successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        message: "Lead Not Found",
      });
    }
    await Lead.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      user: req.user.id,
      action: "Delete Lead",
      details: "Deleted lead " + lead.name,
    });

    res.json({
      message: "Lead Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const agent = await User.findById(assignedTo);
    if (!agent || agent.role !== "supportagent") {
      return res.status(400).json({
        message: "Invalid Support Agent",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
      },
      {
        new: true,
      },
    );

    await ActivityLog.create({
      user: req.user.id,
      action: "Assign Lead",
      details: "Assigned lead to support agent",
    });

    res.json({
      message: "Lead Assigned ",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.addTagToLead = async (req, res) => {
  try {
    const { tagId } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // Don't add duplicate tag
    if (lead.tags.includes(tagId)) {
      return res.status(400).json({
        message: "Tag already added",
      });
    }

    lead.tags.push(tagId);

    await lead.save();

    res.json({
      message: "Tag Added Successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.removeTagFromLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.tags.pull(req.params.tagId);

    await lead.save();

    res.json({
      message: "Tag Removed Successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.searchLead = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const leads = await Lead.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("assignedTo", "name")
      .populate("tags", "tagName");

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.filterLead = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name")
      .populate("tags", "tagName");

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.importLeads = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    for (let i = 0; i < data.length; i++) {
      const lead = data[i];
      const existingLead = await Lead.findOne({
        email: lead.email,
      });

      if (!existingLead) {
        await Lead.create({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
        });
      }
    }
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.source) {
      filter.source = req.query.source;
    }

    const leads = await Lead.find(filter);

    res.status(200).json({
      message: "Excel Imported Successfully",
      totalImported: data.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find();

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Leads");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Source", key: "source", width: 20 },
      { header: "Status", key: "status", width: 20 },
    ];

    leads.forEach((lead) => {
      worksheet.addRow({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=leads.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
