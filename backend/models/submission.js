const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  studentName: String,
  message: String,
  fileUrl: String,
  status: {
    type: String,
    default: "submitted"
  }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);