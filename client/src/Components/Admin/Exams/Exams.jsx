import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import ExamState from "../../../recoil/state/ExamState";
import { useNavigate } from "react-router-dom";

const Exams = () => {
  const navigate = useNavigate();
  const [addexamstate, setaddexam] = useRecoilState(ExamState);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/get-exam-status/${addexamstate.exam_id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setExamStarted(response.data.examStarted);
        }
      } catch (error) {
        console.error("Failed to fetch exam status:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamStatus();
  }, [addexamstate.exam_id]);

  const handleAddExam = (event) => {
    const { name, value } = event.target;
    setaddexam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const route = examStarted ? "/exam-report" : "/addquestions";
    navigate(route);
  };

  if (loading) return <p>Loading exam status...</p>;

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl">Add Exam</h1>
      <hr />
      <h1 className="text-xl pt-4 text-blue-400">Exam Details</h1>
      <hr className="w-28 h-0.5 bg-blue-400 border-0" />
      <form onSubmit={handleSubmit}>
        <div className="pt-4 gap-x-8 gap-y-6 flex flex-wrap">
          {['exam_name', 'exam_duration', 'total_marks', 'passing_marks'].map((field, index) => (
            <div className="flex flex-col" key={index}>
              <label className="text-md" htmlFor={field}>
                {field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
              </label>
              <input
                value={addexamstate[field]}
                onChange={handleAddExam}
                required
                className="w-96 pl-2 hover:outline-blue-400 h-8 border border-black"
                type={field === 'exam_duration' || field === 'total_marks' || field === 'passing_marks' ? 'number' : 'text'}
                name={field}
                id={field}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-10 mr-4">
          <button className={`px-6 py-2 text-white ${examStarted ? 'bg-red-600' : 'bg-blue-800'}`}>
            {examStarted ? 'Finish Exam' : 'Start Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Exams;
