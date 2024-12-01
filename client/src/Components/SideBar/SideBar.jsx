import { RiHome2Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { TbReportSearch } from "react-icons/tb";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SideBar = ({ setUser, user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const url = "http://localhost:4444/logout";
      const response = await axios.post(url, {}, { withCredentials: true }); 

      if (response.status === 200) {
        alert(response.data.message);
        setUser(null);
        navigate("/");
      } else {
        alert("Error while logging out!!!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <section className="h-[776px] w-64 bg-slate-900 flex flex-col justify-center items-center gap-y-10 text-white text-2xl">
      <Link to="/" className="flex items-center space-x-6">
        <RiHome2Line />
        <h1>Home</h1>
      </Link>
      {
        user &&
        <>
          {user && user.isAdmin && (  // Ensure user is defined and an admin
        <Link to="/exams" className="flex items-center space-x-6">
          <TbReportSearch />
          <h1>Exams</h1>
        </Link>
      )}
      <Link to="/reports" className="flex items-center space-x-4">
        <TbReportAnalytics />
        <h1>Reports</h1>
      </Link>
      <button onClick={handleLogout} className="flex items-center space-x-4">
        <CgLogOut />
        <h1>Logout</h1>
      </button>
        </>
      }
      
    </section>
  );
};


export default SideBar;
