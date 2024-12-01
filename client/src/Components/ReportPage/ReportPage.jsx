import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosArrowRoundForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

const ReportPage = () => {
  const [examSessions, setExamSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all exam sessions when the page loads
  useEffect(() => {
    const fetchExamSessions = async () => {
      try {
        const response = await axios.get('http://localhost:4444/get-all-exam-sessions' , {withCredentials:true});
        console.log(response.data.data);
        
        setExamSessions(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchExamSessions();
  }, []);

  // Fetch the report when a specific session is selected
  const fetchReport = async (sessionId) => {
    setLoading(true);
    setSelectedSessionId(sessionId);
    try {
      const response = await axios.get(`http://localhost:4444/get-exam-report/${sessionId}` , {withCredentials:true});
      setReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
       {/* Button to go back to the exam list */}
       {/* <button className='pt-2 pl-6 flex  my-4 text-2xl' onClick={() => setSelectedSessionId(null)}><IoIosArrowRoundBack className='text-4xl pt-1'/> Back to Exams</button> */}
      <h1 className='text-4xl pl-6 pt-5'>Exam Report Page</h1>
      
      {/* Show list of exams when no exam session is selected */}
      {!selectedSessionId && (
        <div className='pl-6 pt-4 '>
          <h2 className='text-3xl '>Your Exams</h2>
          <div className='flex flex-wrap gap-x-4 mt-6 gap-y-5'>
            {examSessions.map((session) => (
              <div className='border bg-slate-900 text-white rounded-lg w-72 border-black px-4 py-2' key={session._id}>
                <p className='text-2xl'>{session.examId.name} - {session.examId.duration} minutes</p>
                <button className='text-xl  border-black flex items-center' onClick={() => fetchReport(session._id)}>View Report <IoIosArrowRoundForward className='text-4xl pt-1 '/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show the report when a session is selected */}
      {selectedSessionId && report && (
        <div style={{ maxHeight: '650px', overflowY: 'auto', padding: '1rem', border: '1px solid #ccc' }}>
          <h2 className='text-3xl'>Report for {report.exam.name}</h2>
          <p className='text-xl pt-2'>Total Questions: {report.totalQuestions}</p>
          <p className='text-xl '>Correct Answers: {report.correctAnswers}</p>
          <p className='text-xl '>Wrong Answers: {report.wrongAnswers}</p>
          <p className='text-xl pb-2'>Score: {report.score}</p>

          <h3 className='text-3xl pb-2'>Question Details</h3>
          <div>
            {report.questions.map((question, index) => (
              <div className='pt-3' key={index}>
                <p className='text-xl'>Question: {question.text}</p>
                <p className='text-lg'>Your Answer: {question.yourAnswer}</p>
                <p className='text-lg'>
                  Correct Answer: {question.correctAnswer === "" ? "Not Answered" : question.correctAnswer}
                </p>
                <p className='text-lg flex'>{question.isCorrect ? <h1 className='flex items-center gap-x-2 text-green-500'>Correct <IoMdCheckmark/> </h1> : <h1 className='flex items-center gap-x-2 text-red-500'>Incorrect <RxCross2/></h1>}</p>
              </div>
            ))}
          </div>

         
        </div>
      )}
    </div>
  );
};

export default ReportPage;
