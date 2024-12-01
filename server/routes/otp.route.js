const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js")
let otpStorage = {}; 

router.post("/send-otp", async (req, res) => {
  try {
    console.log(req.body);
    console.log("ckfcfkc");
    
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otpValue = randomstring.generate({ length: 6, charset: 'numeric' });
    const generatedAt = Date.now(); // Store the current timestamp

    otpStorage[email] = { otp: otpValue, timestamp: generatedAt };

    console.log(`Generated OTP: ${otpValue}`);
    console.log(`Recipient Email: ${email}`);

    // Set up the Nodemailer transporter
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "harshverma8433@gmail.com", 
        pass: "zzhm ygaa jipw gnel", 
      },
    });
    const mailOptions = {
      from: "harshverma8433@gmail.com", // Sender address
      to: email, // Recipient email
      subject: "Your OTP Code", // Subject of the email
      html: `<p>Your OTP is: <strong>${otpValue}</strong></p>`, // HTML body containing the OTP
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error while sending email: ", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("Mail Sent Successfully: ", info.response);
        return res.status(200).json({ message: "OTP sent successfully" });
      }
    });

  } catch (error) {
    console.error("Error in /send-otp route: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("sxmskn");
    console.log(email , otp);
    
    

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOtpData = otpStorage[email];

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    const { otp: storedOtp, timestamp } = storedOtpData;

    
    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const currentTime = Date.now();
    const timeDifference = (currentTime - timestamp) / 1000 / 60; 

    if (timeDifference > 2) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findOne({ email });
    console.log(user);
    
if (!user) {
  return res.status(400).json({ message: "User not found" });
}

const token = jwt.sign(
  { userId: user._id, panel: user.panel },
  process.env.JWT_SECRET,
  {
    expiresIn: "3d",
  }
);

res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
});

return res.status(200).json({ message: "Login successfully", token });


  } catch (error) {
    console.error("Error in /verify-otp route: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;