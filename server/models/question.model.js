const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",  // Reference back to the Exam model
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],  // Array of options
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
}); 

module.exports = mongoose.model("Question", questionSchema);
