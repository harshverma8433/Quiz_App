import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllExam = () => {
    const [exams, setexams] = useState([]);
    const navigate = useNavigate();
    const [finish , setFinish] = useState(false);

    
    const fetchAllExams = async () => {
        try {
            const url = `http://localhost:4444/get-all-exams`;
            const response = await axios.get(url, { withCredentials: true });
            if (response.status === 200) {
                
                setexams(response.data.data);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startExam = async (examId) => {
        
        try {
            const url = `http://localhost:4444/start-exam/${examId}`;
            const response = await axios.post(url,{} ,{withCredentials: true });
            if (response.data.success) {
                navigate(`/exam/${response.data.data._id}`);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllExams();
    }, []);

    return (
        <div className="flex flex-wrap gap-x-4 gap-y-5 px-4 pt-4">
            {exams && exams.length > 0 ? (
                exams.map((exam, key) => (
                    <div className="border border-black w-[24%] px-2 h-[150px]" key={key}>
                        <h1 className="font-semibold text-xl">{exam.name}</h1>
                        <h1>Total Marks: {exam.totalMarks}</h1>
                        <h1>Passing Marks: {exam.passingMarks}</h1>
                        <h1>Duration: {exam.duration}</h1>
                        {
                            exam.finished ? <button className="border-green-600 bg-green-600 border-2 w-full mt-2 py-1 font-semibold cursor-pointer">Finished</button> : <button 
                            onClick={() => startExam(exam._id)}
                            className="border-blue-700 border-2 w-full mt-2 py-1 font-semibold cursor-pointer">
                            Start Exam
                        </button>
                        }
                        
                    </div>
                ))
            ) : (
                <p>No exams found</p>
            )}
        </div>
    );
};

export default AllExam;
