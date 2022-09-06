const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

exports.create = async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  try {
    const boardsCount = await Board.find().count();
    const board = await Board.create({
      user: req.user._id,
      title: req.body.title,
      position: req.body.position !== null ? req.body.position : boardsCount,
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  console.log(req.body);
  try {
    const boards = await Board.find({ user: req.user._id }).sort("position");
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }
    res.status(200).json({ message: "Boards position updated" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getContent = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
    }
    const sections = await Section.find({ board: boardId }).sort("-position");
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id })
        .populate("section")
        .sort("-position");
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { boardId } = req.params;
  console.log("Board Id to be deleted: ", boardId);

  try {
    const selections = await Section.find({ board: boardId });
    for (const selection of selections) {
      await Task.deleteMany({ section: selection.id });
    }
    await Section.deleteMany({ board: boardId });

    await Board.findByIdAndDelete(boardId);

    // update position of other boards
    const boards = await Board.find({ user: req.user._id }).sort("position");
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }

    res.status(200).json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;

  try {
    if (title === "") req.body.title = "Untitled";
    if (description === "") req.body.description = "Add description here";

    const currentBoard = await Board.findById(boardId);

    if (!currentBoard) {
      res.status(404).json({ message: "Board not found" });
    }

    const board = await Board.findByIdAndUpdate(boardId, {
      $set: { title: title, description: description },
    });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};
