const Note = require("../models/Note");
const Lead = require("../models/Lead");

// Add Note
exports.createNote = async (req, res) => {
  try {
    const { leadId, comment } = req.body;

    // Check if lead exists
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const note = new Note({
      leadId,
      comment,
    });

    await note.save();

    res.status(201).json({
      message: "Note Added Successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      leadId: req.params.leadId,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.comment = req.body.comment;

    await note.save();

    res.json({
      message: "Note Updated",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.json({
      message: "Note Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
