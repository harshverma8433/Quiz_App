const mongoose = require("mongoose");

const examSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      selectedOption: {
        type: String, // The selected answer
        default: null,

      },
    },
  ],
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  finished: { type: Boolean, default: false }, // To track if the exam is finished

});

const ExamSession = mongoose.model("ExamSession", examSessionSchema);
module.exports = ExamSession;
