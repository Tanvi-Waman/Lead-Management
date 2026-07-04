const Tag = require("../models/Tag");
exports.createTag = async (req, res) => {
  try {
    const { tagName } = req.body;
    const existingTag = await Tag.findOne({ tagName });
    if (existingTag) {
      return res.status(400).json({
        message: "Tag already exists",
      });
    }
    const tag = new Tag({
      tagName,
    });
    await tag.save();
    res.status(201).json({
      message: "Tag Created",
      tag,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    tag.tagName = req.body.tagName;
    await tag.save();
    res.json({
      message: "Tag updated",
      tag,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    await tag.deleteOne();
    res.json({
      message: "Tag deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
