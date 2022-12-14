const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const sectionSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "normalSection",
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Section", sectionSchema);
