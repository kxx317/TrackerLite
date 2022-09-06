const mongoose = require("mongoose");
const { SchemaOptions, schemaOptions } = require("./modelOptions");

const boardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "📁",
    },
    title: {
      type: String,
      default: "New Board",
    },
    description: {
      type: String,
      default: `Add description here`,
    },
    position: {
      type: Number,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    favouritePosition: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Board", boardSchema);
