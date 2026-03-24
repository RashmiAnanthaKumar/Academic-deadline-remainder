const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// POST /api/tasks → Create Task
router.post("/", taskController.createTask);

// GET /api/tasks → Get All Tasks
router.get("/", taskController.getTasks);

// PUT /api/tasks/:id → Update Task
router.put("/:id", taskController.updateTask);

// DELETE /api/tasks/:id → Delete Task
router.delete("/:id", taskController.deleteTask);

module.exports = router;