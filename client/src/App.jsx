import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import Register from "./Components/Register/Register";
import { useEffect, useState } from "react";
import SideBar from "./Components/SideBar/SideBar";
import Exams from "./Components/Admin/Exams/Exams";
import Question from "./Components/Admin/Question/Question";
import AllExam from "./Components/AllExams/AllExam";
import axios from "axios";
import ReportPage from "./Components/ReportPage/ReportPage";
import ExamInterface from "./Components/ExamInterface/ExamInterface";
import ExamReport from "./Components/ExamReport/ExamReport";
import Otp from "./Components/Otp/Otp";
const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4444/get-user", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data.data); // Set the user data properly
        } else {
          setUser(null); // In case of failure
        }
      } catch (error) {
        setUser(null); // In case of an error
        console.error("Failed to fetch user", error);
      }
    };
  
    fetchUser();
  }, []);
  
  

  const MainLayout = () => (
    <div className="flex">
      <SideBar setUser={setUser} user={user} />
      <div className="flex flex-col w-full">
        <Navbar user={user} /> {/* Passing user to Navbar */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AllExam/>} />
          <Route path="/exams" element={<Exams user={user} />} />
          <Route path="/addquestions" element={<Question user={user} />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/exam-report/:id" element={<ExamReport />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sendotp" element={<Otp setUser={setUser} />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/exam/:id" element={<ExamInterface user={user}/>} />

      </Routes>
    </>
  );
};

export default App;
