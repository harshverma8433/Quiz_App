import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ExamInterface = () => {
  const { id: sessionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [examDuration, setExamDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const timerRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Fetch exam session details and enable fullscreen
  useEffect(() => {
    const fetchExamSession = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4444/get-exam-session/${sessionId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setQuestions(response.data.data.questions);
          setExamDuration(response.data.data.examId.duration); // in minutes
          setRemainingTime(response.data.data.examId.duration * 60); // in seconds
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Error fetching exam session. Please try again.");
      } finally {
        setLoading(false);
        enableFullScreen();
      }
    };

    fetchExamSession();
  }, [sessionId]);

  // Timer and event listeners for warnings
  useEffect(() => {
    if (remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    if (remainingTime === 0 && !loading) {
      setIsFinishing(true);
      setTimeout(() => {
        finishExam();
      }, 5000);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setRemainingTime((prev) => Math.max(prev - 600, 0)); // Reduce time by 10 minutes
        triggerWarning();
      }
    };

    const handleKeyDown = (event) => {
      event.preventDefault();
      triggerWarning();
    };

    const handleEscKey = (event) => {
      if (document.fullscreenElement) {
        event.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [remainingTime, loading]);

  const triggerWarning = () => {
    if (!showWarning) {
      setShowWarning(true);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(false);
        enableFullScreen();
      }, 5000);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleOptionChange = (option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: option,
    }));
  };

  const handleSubmitAnswer = async () => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `http://localhost:4444/submit-response/${sessionId}`,
        {
          questionId: questions[currentQuestion].questionId._id,
          selectedOption: answers[currentQuestion],
        },
        { withCredentials: true }
      );
      if (!response.data.success) {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error submitting response.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      await handleSubmitAnswer();
      setCurrentQuestion(currentQuestion + 1);
      setVisitedQuestions((prev) => [...prev, currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setVisitedQuestions((prev) => [...prev, currentQuestion - 1]);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setVisitedQuestions((prev) => [...prev, index]);
  };

  const finishExam = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4444/finish-exam/${sessionId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate(`/`);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error finishing exam.");
    }
  };

  const enableFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white relative">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center text-center text-white">
          <p className="text-2xl mb-6">⚠️ Warning: Exam Rules Violation!</p>
          <p className="text-lg mb-8">
            Do not leave the exam tab or press prohibited keys.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowWarning(false);
                enableFullScreen();
              }}
              className="bg-blue-500 px-6 py-3 rounded-md"
            >
              Continue Exam
            </button>
            <button
              onClick={finishExam}
              className="bg-red-500 px-6 py-3 rounded-md"
            >
              Finish Exam
            </button>
          </div>
        </div>
      )}

      {/* Finish Exam Prompt */}
      {showFinishPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col justify-center items-center text-center text-white">
          <p className="text-2xl mb-6">Are you sure you want to finish your exam?</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowFinishPrompt(false);
                enableFullScreen();
              }}
              className="bg-blue-500 px-6 py-3 rounded-md"
            >
              Continue Exam
            </button>
            <button
              onClick={finishExam}
              className="bg-red-500 px-6 py-3 rounded-md"
            >
              Finish Exam
            </button>
          </div>
        </div>
      )}

      {isFinishing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center text-center text-white">
          <p className="text-xl">Finishing the exam... Please wait.</p>
        </div>
      )}

      {/* Main Content */}
      <div className="w-[70%]">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : questions.length > 0 ? (
          <div className="pt-12 pl-12">
            <div className="flex justify-between mb-12">
              <div className="flex items-center space-x-6">
                <p className="text-xl">
                  Question: {currentQuestion + 1} / {questions.length}
                </p>
                <p className="text-xl">Remaining Time: {formatTime(remainingTime)}</p>
              </div>
              <div className="flex items-center mr-10">
                <button
                  onClick={() => setShowFinishPrompt(true)}
                  className="px-4 py-2 bg-green-500 rounded-md"
                >
                  Finish Exam
                </button>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-6">
                {questions[currentQuestion]?.questionId?.content}
              </h1>
              {questions[currentQuestion]?.questionId?.options.map((option, index) => (
                <div key={index}>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() => handleOptionChange(option)}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex mt-12 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-500 rounded-md"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className="px-6 py-3 bg-blue-500 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No questions available for this exam.</p>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-[30%] bg-gray-800">
        <div className="pt-12 pl-12">
          <p className="text-2xl font-bold mb-8">Questions</p>
          <div>
            {questions.map((_, index) => (
              <div
                key={index}
                className={`cursor-pointer py-2 text-center ${
                  visitedQuestions.includes(index)
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-gray-400"
                }`}
                onClick={() => handleQuestionClick(index)}
              >
                Question {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;