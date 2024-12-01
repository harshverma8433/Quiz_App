import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import LoginState from "../../recoil/state/LoginState.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo3 from "./Logo3.png";
import insta from "./insta.png"
import linkedin from "./linkedin.png"
import x from "./x.png"
import youtube from "./youtube.png"

const LoginPage = () => {
  const navigate = useNavigate();

  const [LoginPayload, setPayload] = useRecoilState(LoginState);

  const handlePayload = (event) => {
    const { name, value } = event.target;
    setPayload({
      ...LoginPayload,
      [name]: value,
    });
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:4444/get-user", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.data); // Set the user
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:4444/login";
      const response = await axios.post(url, LoginPayload, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        
        alert(response.data.message);
        // fetchUser();
        navigate("/sendotp");
      } else if ([201, 202, 203].includes(response.status)) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex pt-16 min-h-screen gap-x-12 bg-black pl-12">
        <div className=" w-[54%]  pt-10 items-end flex flex-col">
          <div className="flex justify-start w-[50%] gap-x-4 mr-6">
            <img src={Logo3} alt="icon" className="w-64 h-16" />
          </div>
          <form action="#" onSubmit={handleLogin}>
            <h1 className="font-outfit text-[20px] text-start font-normal leading-[23.87px] text-white py-6">
              Please Enter your Account details
            </h1>

            <h1 className="text-xl mb-2 font-bold leading-tight tracking-tight bg-black md:text-2xl dark:text-white text-center">
              <select
                onChange={handlePayload}
                name="panel"
                id="panel"
                className="bg-black focus:outline-none cursor-pointer"
              >
                <option value="user">Login As User</option>
                <option value="admin">Login As Admin</option>
              </select>
            </h1>

            <div className="flex flex-col pb-10">
              <label
                htmlFor="email"
                className="text-white font-outfit text-[20px] font-normal leading-[23.87px] text-left pb-3"
              >
                Email
              </label>
              <input
                className="w-[95%] px-2 py-2 rounded-xl bg-[#8FA0B1] text-black placeholder-black focus:outline-0"
                onChange={handlePayload}
                type="email"
                name="email"
                id="email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-white font-outfit text-[20px] font-normal leading-[23.87px] text-left pb-3"
              >
                Password
              </label>
              <input
                className="w-[95%] px-2 py-2 rounded-xl bg-[#8FA0B1] text-black placeholder-black focus:outline-0"
                onChange={handlePayload}
                type="password"
                name="password"
                id="password"
                required
              />
            </div>
            <p className="font-outfit w-[95%] pr-2 text-[14px] font-normal pt-1 underline leading-[23.87px] text-right text-white hover:underline">
              Forgot Password
            </p>

            <div className="justify-center item-center pt-4">
              <button
                type="submit"
                className="bg-[#1D3E64] border-none justify-center text-white text-lg rounded-2xl py-2 cursor-pointer item-center my-2 w-96"
              >
                Sign In
              </button>
            </div>

            <div className="flex gap-x-4 mt-3 justify-center pr-4">
              <img className="w-8" src={x} alt="" />
              <img className="w-8" src={insta} alt="" />
              <img className="w-8" src={youtube} alt="" />
              <img className="w-8" src={linkedin} alt="" />
            </div>

            <div className="w-[95%] text-end pt-10">
              <Link
                to="/register"
                className="text-white hover:underline underline font-outfit text-[14px]  font-normal leading-[23.87px] text-left"
              >
                Create an Account
              </Link>
            </div>
          </form>
        </div>

        {/* Right Half  */}
        <div className=" w-[55%]">
          <div className="w-[53%] flex justify-center pb-10 py-[42%] rounded-xl h-[85%] bg-gradient-to-br from-[#0D315C] to-[#728191] mt-4">
            <div className="w-full  gap-x-4 bg-white mx-4 my-4 rounded-xl shadow-lg px-2 flex justify-between h-48 items-center relative bottom-[-70px]">
              <div className="w-12 h-12 ml-2 mt-6 px-16 py-16 mb-12 bg-gray-500 rounded-full"></div>

              <div className="flex-col  flex justify-start items-start">
                <p className="text-xs text-gray-700 text-start">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  laoreet purus lacus, eget sodales velit lobortis quis. Quisque
                  eget purus arcu.
                </p>
                <div className="mt-2 text-center">
                  <p className="font-bold text-sm text-black">Name Name</p>
                  <p className="text-gray-500 text-sm">Designation</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
