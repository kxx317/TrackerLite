const { schemaOptions } = require("../models/modelOptions");
const Section = require("../models/section");
const Task = require("../models/task");

exports.create = async (req, res) => {
  const { sectionId } = req.body;
  try {
    const section = await Section.findById(sectionId);
    const tasksCount = await Task.find({ section: sectionId }).count();
    const task = await Task.create({
      section: sectionId,
      position: tasksCount,
    });
    task._doc.section = section;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

exports.delete = async (req, res) => {
  const { taskId } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    const tasks = await Task.find({ section: deletedTask.section });
    for (const key in tasks) {
      await Task.findByIdAndUpdate(tasks[key]._id, { $set: { position: key } });
    }

    res.status(200).json(`Task "${deletedTask.title}" deleted`);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

exports.updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;
  const resourceListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();
  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReverse) {
        await Task.findByIdAndUpdate(resourceListReverse[key].id, {
          $set: {
            section: resourceSectionId,
            position: key,
          },
        });
      }
    }
    for (const key in destinationListReverse) {
      await Task.findByIdAndUpdate(destinationListReverse[key].id, {
        $set: {
          section: destinationSectionId,
          position: key,
        },
      });
    }
    res.status(200).json(`Task position updated`);
  } catch (err) {
    res.status(500).json(err);
  }
};
