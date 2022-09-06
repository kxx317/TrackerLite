const mongoose = require("mongoose");
const { SchemaOptions, schemaOptions } = require("./modelOptions");

const taskSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
    },
    timerStart: {
      type: Number,
    },
    timerEnd: {
      type: Number,
    },
    timerRunning: {
      type: Boolean,
      default: false,
    },
    timerDuration: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Task", taskSchema);
