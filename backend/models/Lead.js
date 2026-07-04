const mongoose = require("mongoose");
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lead", leadSchema);
