import { useRecoilValue } from "recoil";
import ExamState from "../../../recoil/state/ExamState";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import * as XLSX from "xlsx";

const Question = () => {
    const examValue = useRecoilValue(ExamState);
    const [addexamstate, setaddexam] = useRecoilState(ExamState);
    const navigate = useNavigate();

    // Initialize state with the total number of questions
    const [questions, setQuestions] = useState(
        Array.from({ length: examValue.total_question || 1 }, () => ({
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        }))
    );

    // Handle change for question text
    const handleQuestionChange = (index, event) => {
        const { name, value } = event.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [name]: value,
        };
        setQuestions(updatedQuestions);
    };

    // Handle change for each option text
    const handleOptionChange = (qIndex, optIndex, event) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = event.target.value;
        setQuestions(updatedQuestions);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            examValue,
            questions,
        };
        const uri = `http://localhost:4444/addExam`;
        const response = await axios.post(uri, data, { withCredentials: true });
        if (response.status === 200) {
            alert(response.data.message);
            setaddexam({
                exam_name: "",
                exam_duration: "",
                total_question: "",
                total_marks: "",
                passing_marks: "",
            });
            navigate("/");
        } else {
            alert(response.data.message);
        }
    };

    // Handle adding a new question
    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: "",
            },
        ]);
    };

    // Handle Excel file upload and parsing
// Handle Excel file upload and parsing
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert the worksheet to JSON, skipping the header row (row 0)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Skip the first row (headers) by slicing the array
            const dataWithoutHeaders = jsonData.slice(1);

            // Assuming the structure: [Question, Option1, Option2, Option3, Option4, CorrectAnswer]
            const parsedQuestions = dataWithoutHeaders.map((row) => ({
                question: row[0] || "",
                options: [row[1] || "", row[2] || "", row[3] || "", row[4] || ""],
                correctAnswer: row[5] || "",
            }));

            // If the current questions are only the initial empty ones, replace them, otherwise append.
            setQuestions((prevQuestions) =>
                prevQuestions.length === 1 && !prevQuestions[0].question.trim()
                    ? parsedQuestions
                    : [...prevQuestions, ...parsedQuestions]
            );
        };
        reader.readAsArrayBuffer(file);
    }
};

    return (
        <div className="px-6 py-4">
            <h1 className="text-2xl">Add Questions for: {examValue.exam_name}</h1>
            <hr />

            {/* Scrollable container for the form */}
            <div className="max-h-[80vh] overflow-y-auto mt-6">
                {/* File Upload for Excel */}
                <div className="my-4">
                    <label htmlFor="upload" className="mr-2 text-lg">Upload Excel Sheet:</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="upload"
                        onChange={handleFileUpload}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {questions.map((q, index) => (
                        <div key={index} className="">
                            {/* Question Input */}
                            <div className="flex flex-col">
                                <label className="text-xl font-semibold" htmlFor={`question_${index}`}>
                                    Question {index + 1}
                                </label>
                                <input
                                    value={q.question}
                                    onChange={(event) => handleQuestionChange(index, event)}
                                    required
                                    className="w-[97.3%] pl-2 hover:outline-blue-400 h-8 border border-black mt-2"
                                    type="text"
                                    name="question"
                                    id={`question_${index}`}
                                />
                            </div>

                            {/* Options Inputs */}
                            <div className="mt-4">
                                <h2 className="text-md">Options</h2>
                                <div className="gap-y-4 grid grid-cols-3">
                                    {[0, 1, 2, 3].map((optIndex) => (
                                        <input
                                            key={optIndex}
                                            value={q.options[optIndex]}
                                            onChange={(event) => handleOptionChange(index, optIndex, event)}
                                            required
                                            className="w-96 pl-2 hover:outline-blue-400 h-8 border border-black mt-2"
                                            type="text"
                                            placeholder={`Option ${optIndex + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Correct Answer Input */}
                            <div className="mt-4 flex flex-col">
                                <label className="text-md" htmlFor={`correct_answer_${index}`}>
                                    Correct Answer
                                </label>
                                <input
                                    value={q.correctAnswer}
                                    onChange={(event) => handleQuestionChange(index, event)}
                                    required
                                    className="w-96 pl-2 hover:outline-blue-400 h-8 border border-black mt-2"
                                    type="text"
                                    name="correctAnswer"
                                    id={`correct_answer_${index}`}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Question Button */}
                    <div className="flex justify-start mt-6">
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-400 px-4 py-2 text-white"
                            onClick={handleAddQuestion}
                        >
                            Add Question
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-10 mr-4">
                        <button className="bg-blue-800 hover:bg-blue-500 px-6 py-2 text-white">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Question;
