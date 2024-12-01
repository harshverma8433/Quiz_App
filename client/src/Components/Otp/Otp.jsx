import "./Otp.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginState from "../../recoil/state/LoginState";
import { useRecoilValue } from "recoil";

const Otp = ({ setUser }) => {


  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isValid, setIsValid] = useState(false);
  const loginState = useRecoilValue(LoginState);
  const email = loginState.email;
  console.log("email" , email);
  
  const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart.slice(0, 3).padEnd(localPart.length, '*'); // Mask everything but first 3 characters
    console.log("maskedLocalPart" , maskedLocalPart);
    



  // Run sendOtp only once when the component mounts
  useEffect(() => {
    sendOtp();
  }, []);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      const url = `http://localhost:4444/send-otp`;


      const response = await axios.post(url, { email } , {withCredentials:true});

      if (response.status === 200) {
        
        console("OTP sent successfully!");
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("An error occurred while sending OTP. Please try again.");
    }
  };

  // Function to verify OTP
  const VerifyOtp = async (otpValue) => {
    try {
      const url = `http://localhost:4444/verify-otp`;

      const response = await axios.post(url, { email, otp: otpValue } , {withCredentials:true});
        console.log(response , "rees");
        
      if (response.status === 200) {

        alert("Login Successfully!");
        fetchUser();
        navigate("/"); // Redirect to home or desired page after successful verification
      } else {
        alert("OTP Wrong/Expired.");
      }
    } catch (error) {
      
      alert("OTP Wrong/Expired.");
    }
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

  const handleChange = (element, index) => {
    if (!isNaN(element.value)) {
      let newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      // Move to the next input field
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }

      // Check if OTP is fully entered (all 6 digits)
      const otpValue = newOtp.join("");
      if (otpValue.length === 6 && !newOtp.includes("")) {
        setIsValid(true);
        VerifyOtp(otpValue); // Call VerifyOtp once the OTP is fully entered
      } else {
        setIsValid(false);
      }
    }
  };

  const handleKeyUp = (e, index) => {
    // Backspace handling
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      e.target.previousSibling.focus();
    }
  };

  return (
    <>

      <form className="otp-form min-h-screen  pt-36 bg-slate-950" name="otp-form">
        <div className="text-center">
          <h3 className="text-5xl text-white pb-6">OTP VERIFICATION</h3>
          <p className="text-xl pb-4 text-white text-center">An otp has been sent to {`${maskedLocalPart}@${domain}`}</p>
          <p className="text-white text-lg">Please enter OTP to verify</p>
        </div>
        <div className="otp-input-fields bg-slate-950">
          {otp.map((value, index) => (
            <input
            
              key={index}
              type="text"
              maxLength="1"
              className={`otp__digit otp__field__${index + 1}`}
              value={value}
              onChange={(e) => handleChange(e.target, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
            />
          ))}
        </div>
          <h1 className="text-center pl-[500px] cursor-pointer text-white " onClick={sendOtp}>Resend Code</h1>
      </form>
    </>
  );
};

export default Otp;
