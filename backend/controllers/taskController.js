const Task = require("../models/task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    const existingTask = await Task.findOne({ title, deadline });

    if (existingTask) {
      return res.status(400).json({ message: "Task already exists!" });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};