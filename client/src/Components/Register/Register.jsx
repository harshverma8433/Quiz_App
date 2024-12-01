import { Link } from "react-router-dom";
import {useRecoilState} from "recoil";
import RegisterState from "../../recoil/state/RegisterState.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaInstagram, FaLinkedin, FaTimes } from "react-icons/fa";
import insta from "./insta.png"
import linkedin from "./linkedin.png"
import x from "./x.png"


const Register = () => {
    const navigate = useNavigate();

    const [payload , setPayload] = useRecoilState(RegisterState);

    const handlePayload = (event) => {
        const { name, value } = event.target; 
        setPayload({
          ...payload, 
          [name]: value, 
        });
      };
      

    const handleRegistration = async (event) => {
        event.preventDefault();
        try{
            // const url = process.env.REACT_APP_URL;
            const url = "http://localhost:4444/register"
            const response = await axios.post(url , payload);
            if(response.status === 200){
                alert(response.data.message);
                navigate("/login") 
            }else if([201,202].includes(response.status)){
                alert(response.data.message)
            }
            
        }catch(error){
            console.log(error);
            
        }
    }
        
  return (
    // <section className="bg-gray-50 dark:bg-gray-900">
    //   <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    //     <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"> Kodex</h1>
    //     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
    //       <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
    //         <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
    //           Create an account
    //         </h1>
    //         <form className="space-y-4 md:space-y-6" onSubmit={handleRegistration}>
    //           <div>
    //             <label
    //               htmlFor="name"
    //               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //             >
    //               Name
    //             </label>
    //             <input
    //               type="name"
    //               name="name"
    //               id="name"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               placeholder="Enter Your Email"
    //               onChange={handlePayload}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <label
    //               htmlFor="email"
    //               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //             >
    //               Your email
    //             </label>
    //             <input
    //               type="email"
    //               name="email"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               id="email"
    //               placeholder="Enter Your Email"
    //               onChange={handlePayload}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <label
    //               htmlFor="password"
    //               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //             >
    //               Password
    //             </label>
    //             <input
    //               type="password"
    //               name="password"
    //               id="password"
    //               placeholder="••••••••"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               required
    //               onChange={handlePayload}
    //             />
    //           </div>
    //           <div>
    //             <label
    //               htmlFor="confirm_password"
    //               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //             >
    //               Confirm password
    //             </label>
    //             <input
    //               type="confirm_password"
    //               name="confirm_password"
    //               id="confirm_password"
    //               placeholder="••••••••"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               required
    //               onChange={handlePayload}
    //             />
    //           </div>
    //           <div className="flex items-start">
    //             <div className="flex items-center h-5">
    //               <input
    //                 id="terms"
    //                 aria-describedby="terms"
    //                 type="checkbox"
    //                 className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
    //                 required
    //               />
    //             </div>
    //             <div className="ml-3 text-sm">
    //               <label
    //                 htmlFor="terms"
    //                 className="font-light text-gray-500 dark:text-gray-300"
    //               >
    //                 I accept the{" "}
    //                 <a
    //                   className="font-medium text-primary-600 hover:underline dark:text-primary-500"
    //                   href="#"
    //                 >
    //                   Terms and Conditions
    //                 </a>
    //               </label>
    //             </div>
    //           </div>
    //           <button
    //             type="submit"
    //             className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-600 hover:bg-blue-400"
    //           >
    //             Create an account
    //           </button>
    //           <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
    //             Already have an account?{" "}
    //             <Link
    //               to="/login"
    //               className="font-medium text-primary-600 hover:underline dark:text-primary-500"
    //             >
    //               Login here
    //             </Link>
    //           </p>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <div className="flex h-screen w-full">
      {/* Left half */}
      <div className="w-[45%] pt-28 pl-72 justify-center flex  bg-black">
        <div className="flex flex-col items-start space-y-2 ">
          <div className="pb-10 ">
            <button className="text-white px-10 py-3 rounded-full bg-[#363739]  focus:outline-0 font-outfit text-[24px] font-normal leading-[23.87px] text-left">
              Contact Us
            </button>
          </div>

          <h1 className="text-white font-outfit text-[35px] font-normal leading-[23.87px] text-left pb-10">
            How can we help you ?
          </h1>

          <p className="text-white font-outfit text-[20px] font-normal leading-[23.87px] text-left">
            You can fill the form or drop an email to <br />
          </p>
          <p className="text-white pb-6 font-outfit text-[20px] font-normal leading-[23.87px] text-left">
            vijay.singh@kodevortex.in
          </p>

          <div className="flex flex-col items-start space-y-6 pt-6 ">
            <button className="flex items-center bg-[#23565F] justify-center text-white rounded-full  w-44 h-12  space-x-2">
              <FaGoogle className="text-xl" />
              <span>kodevortex</span>
            </button>

            <button className="flex items-center bg-[#23565F] justify-center text-white rounded-full  w-44 h-12  space-x-2">
              <img className="w-8" src={insta} alt="" />
              <span>kodevortex</span>
            </button>

            <button className="flex items-center bg-[#23565F] justify-center text-white rounded-full  w-44 h-12  space-x-2">
              <img className="w-8" src={linkedin} alt="" />
              <span>KodeVortex</span>
            </button>

            <button className="flex items-center bg-[#23565F] justify-center text-white rounded-full  w-44 h-12  space-x-2">
             <img className="w-8" src={x} alt="" />
              <span>KodeVortex</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right half */}
      <div className="w-[55%] pr-[28%] bg-black text-white flex pt-16 justify-center">
        <form className="space-y-6"  onSubmit={handleRegistration}>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="pb-2 text-start font-outfit text-[20px] font-normal leading-[23.87px]"
            >
              Full Name
            </label>
            <input
              className="w-[200%] px-2 pl-4 py-1.5 rounded-3xl bg-[#B8B8B8] text-black placeholder-black focus:outline-0"
              type="text"
              name="name"
              id="name"
              autoFocus
              placeholder="Enter you Full Name"
              onChange={handlePayload}
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="pb-2 text-start font-outfit text-[20px] font-normal leading-[23.87px] "
            >
              Email Address
            </label>
            <input
              className="w-[200%] px-2 py-1.5 pl-4  rounded-3xl bg-[#B8B8B8] text-black placeholder-black focus:outline-0"
              type="email"
              name="email"
              autoFocus
              id="email"
              placeholder="Enter Your Email"
              onChange={handlePayload}
              required
            />
          </div>

          <div>
            <div className="flex flex-col">
              <label
                htmlFor="phone_no"
                className="pb-2 text-start font-outfit text-[20px] font-normal leading-[23.87px] "
              >
                Phone Number
              </label>
              <input
                className="w-[200%] px-2 py-1.5 pl-4 rounded-3xl bg-[#B8B8B8] text-black placeholder-black focus:outline-0"
                type="phone_no"
                name="phone_no"
                autoFocus
                placeholder="Enter you Phone Numer"
                id="phone_no"
                onChange={handlePayload}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="pb-2 text-start font-outfit text-[20px] font-normal leading-[23.87px] "
              >
                Password
              </label>
              <input
                className="w-[200%] px-2 py-1.5 pl-4 rounded-3xl bg-[#B8B8B8] text-black placeholder-black focus:outline-0"
                type="password"
                name="password"
                autoFocus
                placeholder="Enter you Password"
                id="password"
                onChange={handlePayload}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="pb-2 text-start font-outfit text-[20px] font-normal leading-[23.87px] text-leftfont-outfit "
            >
              Message
            </label>
            <textarea
              name="message"
              className="w-[200%] px-2 h-32 py-2 pl- rounded-2xl bg-[#B8B8B8] text-black placeholder-black focus:outline-0"
              id="message"
              placeholder="Enter Your Text Here"
              onChange={handlePayload}
              required
            ></textarea>
          </div>

          <div className="flex justify-start gap-x-3">
            <input type="checkbox" name="policy" id="policy" required/>
            <label htmlFor="policy">
              I agree to your{" "}
              <span className="text-blue-500">Privacy Policy</span> terms.
            </label>
          </div>

          <div className=" w-[200%]">
            <button
              type="submit "
              className="w-full py-2.5 rounded-3xl bg-[#0D315C]"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
