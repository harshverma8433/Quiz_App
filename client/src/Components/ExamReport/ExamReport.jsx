import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ExamReport = () => {
  const { id: sessionId } = useParams(); // Get sessionId from URL params
  const [report, setReport] = useState(null); // State to hold the report data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4444/get-exam-report/${sessionId}`, { withCredentials: true });
        if (response.data.success) {
          setReport(response.data.data); // Set the report data
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Error fetching exam report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading report...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : report ? (
        <div>
          <h1>Exam Report</h1>
          <p>Total Questions: {report.totalQuestions}</p>
          <p>Correct Answers: {report.correctAnswers}</p>
          <p>Wrong Answers: {report.wrongAnswers}</p>
          <p>Score: {report.score}</p>

          {/* Optionally, show a detailed breakdown */}
          <h2>Question Breakdown</h2>
          <ul>
            {report.questions.map((question, index) => (
              <li key={index}>
                <p>
                  <strong>Question {index + 1}:</strong> {question.text}
                </p>
                <p>
                  <strong>Your Answer:</strong> {question.yourAnswer}
                </p>
                <p>
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </p>
                <p>
                  <strong>Status:</strong> {question.isCorrect ? "Correct" : "Incorrect"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No report available.</p>
      )}
    </div>
  );
};

export default ExamReport;
