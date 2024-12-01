const router = require("express").Router();
const Exam = require("../models/exam.model.js");
const Question = require("../models/question.model.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const ExamSession = require("../models/examSession.model.js")
const Report = require("../models/report.model.js")
// add exam
// router.post("/addExam", authMiddleware, async (req, res) => {
//   const { userId } = req.user;

//   try {

//       // Check for existing exam
//       // console.log("req.body" , req.body);
      
//       const examExists = await Exam.findOne({ name: req.body.examValue.exam_name });
//       if (examExists) {
//           return res.status(400).json({ message: "Exam already exists", success: false });
//       }

//       // Destructure required fields from body
//       const { exam_name, exam_duration, total_marks, passing_marks } = req.body.examValue;
//       const ques = req.body.questions;

      

//       if (!exam_name || !exam_duration || !total_marks || !passing_marks) {
//           return res.status(400).json({
//               message: "All fields are required.",
//               success: false,
//           });
//       }

//       // console.log("qwq", ques);
      

//       // Create new exam
//       const newExam = new Exam({
//           name: exam_name,
//           duration: exam_duration,
//           totalMarks: total_marks,
//           passingMarks: passing_marks,
//           userId: userId,
//       });



//       const savedExam = await newExam.save();
     

//       // Map questions to correct format
//       const questions = ques.map((questionData) => ({
//           examId: savedExam._id,
//           question: questionData.question,
//           options: questionData.options,
//           correctAnswer: questionData.correctAnswer,
//       }));

      
      
//      await Question.insertMany(questions);


//       return res.status(200).json({
//           message: "Exam and questions added successfully",
//           success: true,
//       });
//   } catch (error) {
//       console.error("Error adding exam:", error); // Enhanced error logging
//       res.status(500).json({
//           message: "An error occurred while adding the exam. Please try again later.",
//           success: false,
//       });
//   }
// });

router.post("/addExam", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    // Check for existing exam
    const examExists = await Exam.findOne({ name: req.body.examValue.exam_name });
    if (examExists) {
      return res.status(400).json({ message: "Exam already exists", success: false });
    }

    const { exam_name, exam_duration, total_marks, passing_marks } = req.body.examValue;
    const ques = req.body.questions;

    if (!exam_name || !exam_duration || !total_marks || !passing_marks) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    console.log(exam_name);
    

    // Create new exam
    const newExam = new Exam({
      name: exam_name,
      duration: exam_duration,
      totalMarks: total_marks,
      passingMarks: passing_marks,
      userId: userId,
    });

    console.log(newExam);
    

    const savedExam = await newExam.save();

    // Create questions and get their IDs
    const questions = ques.map((questionData) => ({
      examId: savedExam._id,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
    }));

    const createdQuestions = await Question.insertMany(questions);

    // Extract question IDs and add to the exam
    const questionIds = createdQuestions.map((q) => q._id);
    savedExam.questions = questionIds;

    console.log('sav' , savedExam);
    

    // Save exam again with question IDs
    await savedExam.save();

    return res.status(200).json({
      message: "Exam and questions added successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding exam:", error);
    res.status(500).json({
      message: "An error occurred while adding the exam. Please try again later.",
      success: false,
    });
  }
});

// Get all exams and check if already started
router.get("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch all exams and populate questions
    const exams = await Exam.find({}).populate("questions");

    // Check if the user has any existing exam sessions
    const examSessions = await ExamSession.find({ userId }).populate("examId");


    // Map through each exam and attach the 'finished' status if a session exists
    const responseExams = exams.map(exam => {
      // Find the corresponding session for this exam, if any
      const existingSession = examSessions.find(session => session.examId._id.equals(exam._id));

      return {
        ...exam.toObject(), // Convert the Mongoose document to a plain object
        finished: existingSession ? existingSession.finished : false, // Include 'finished' status
      };
    });

    // Debugging response exams
    console.log(responseExams);

    // Send the response
    res.status(200).send({
      message: "Exams fetched successfully",
      data: responseExams,
      success: true,
    });
  } catch (error) {
    // Error handling
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});



// Start exam route

router.post("/start-exam/:examId", authMiddleware, async (req, res) => {
  try {
    const { examId } = req.params;
    const { userId } = req.user;

    // Check for existing exam session
    const existingExamSession = await ExamSession.findOne({ userId, examId });

    if (existingExamSession) {
      if (existingExamSession.finished) {
        return res.status(200).json({
          message: "You have already finished this exam.",
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "You have already started this exam.",
          success: false,
        });
      }
    }

    // Fetch the exam and populate questions
    const exam = await Exam.findById(examId).populate("questions");

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
        success: false,
      });
    }

    // Create a new exam session for the user
    const newExamSession = new ExamSession({
      userId,
      examId,
      questions: exam.questions.map(q => ({
        questionId: q._id,
        selectedOption: null, // Initially, no option is selected
      })),
    });

    await newExamSession.save();

    res.status(200).json({
      message: "Exam started successfully",
      success: true,
      data: newExamSession,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});




// Fetch specific exam session route
router.get("/get-exam-session/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Populate the questionId to get the full question details and also populate the examId field
    const examSession = await ExamSession.findById(sessionId)
      .populate("questions.questionId")  // Populate question details
      .populate("examId"); // Correct the population of examId

    if (!examSession) {
      return res.status(404).json({
        message: "Exam session not found",
        success: false,
      });
    }


    res.status(200).json({
      message: "Exam session fetched successfully",
      success: true,
      data:examSession,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});



// Submit question response
router.post("/submit-response/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, selectedOption } = req.body;

    // Find the exam session
    const examSession = await ExamSession.findById(sessionId);
    const question = examSession.questions.find(
      (q) => q.questionId.toString() === questionId
    );

    if (question) {
      question.selectedOption = selectedOption;
      await examSession.save();
      console.log("qq" , question);
      
      res.status(200).json({
        message: "Response submitted successfully",
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Question not found in the session",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});


// Finish exam and generate report
router.post("/finish-exam/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Fetch the exam session and exam details
    const examSession = await ExamSession.findById(sessionId).populate("examId");
    const exam = await Exam.findById(examSession.examId).populate("questions");

    let score = 0;
    exam.questions.forEach((question, index) => {
      if (question.correctAnswer === examSession.questions[index].selectedOption) {
        score += 1;
      }
    });

    const report = {
      userId: examSession.userId,
      examId: examSession.examId,
      score,
      totalMarks: exam.totalMarks,
      passStatus: score >= exam.passingMarks ? "Passed" : "Failed",
    };

    // Save the report
    const newReport = new Report(report);
    await newReport.save();

    // Update the exam session to mark it as finished
    examSession.finished = true; // Set finish to true
    await examSession.save(); // Save the updated exam session

    res.status(200).json({
      message: "Exam completed and report generated",
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});


module.exports = router;
