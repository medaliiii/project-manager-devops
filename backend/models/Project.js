const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", ProjectSchema);
