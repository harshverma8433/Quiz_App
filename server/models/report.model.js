const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam", // Reference to the exam model
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passStatus: {
      type: String,
      enum: ["Passed", "Failed"], // Either "Passed" or "Failed"
      required: true,
    },
    timeTaken: {
      type: Number, // Optionally, you could store the time taken by the user to complete the exam
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
