const express = require("express");
const router = express.Router();
const multer = require("multer");

const submissions = [];

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ POST submission (with file)
router.post("/", upload.single("file"), (req, res) => {
  const { taskId, studentName, message } = req.body;

  const newSubmission = {
    taskId,
    studentName,
    message,
    file: req.file ? req.file.filename : null
  };

  submissions.push(newSubmission);

  res.json({ message: "Submitted successfully" });
});

// ✅ GET all submissions
router.get("/", (req, res) => {
  res.json(submissions);
});

module.exports = router;