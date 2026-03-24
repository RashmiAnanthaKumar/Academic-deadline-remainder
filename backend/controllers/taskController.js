const Task = require("../models/Task");

// Create Task (with duplicate check)
exports.createTask = async (req, res) => {
  try {
    const existingTask = await Task.findOne({
      title: req.body.title,
      deadline: req.body.deadline
    });

    if (existingTask) {
      return res.status(400).json({ message: "Task already exists!" });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task (mark as completed or change details)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body, // allows updating status or other fields
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

// Delete Task
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