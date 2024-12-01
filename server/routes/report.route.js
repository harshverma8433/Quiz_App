const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const Exam = require("../models/exam.model.js");
const ExamSession = require("../models/examSession.model.js");

// Fetch all exam sessions for the logged-in user
router.get('/get-all-exam-sessions', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    console.log("Fetching sessions for user:", userId); // Log user ID

      const sessions = await ExamSession.find({ userId }).populate("examId");

      if (sessions.length === 0) {
          console.log("No exam sessions found for user:", userId);
      }

      res.status(200).json({ data: sessions });
  } catch (err) {
      console.error("Error retrieving exam sessions:", err); // Log the error
      res.status(500).json({ message: 'Error retrieving exam sessions', error: err });
  }
});


// Fetch exam report by sessionId and for the logged-in user
router.get("/get-exam-report/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.user

    // Fetch the exam session for the logged-in user and populate related exam details
    const examSession = await ExamSession.findOne({ _id: sessionId, userId }).populate("examId");
    if (!examSession) {
      return res.status(404).json({
        message: "Exam session not found for the user",
        success: false,
      });
    }

    const exam = await Exam.findById(examSession.examId).populate("questions");

    // Prepare report data
    let correctAnswers = 0;
    const questions = exam.questions.map((question, index) => {
      const userAnswer = examSession.questions[index].selectedOption;
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) correctAnswers++;

      return {
        text: question.question,
        yourAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
      };
    });

    const totalQuestions = exam.questions.length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const score = correctAnswers;

    res.status(200).json({
      message: "Exam report fetched successfully",
      success: true,
      data: {
        exam: examSession.examId,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        score,
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
