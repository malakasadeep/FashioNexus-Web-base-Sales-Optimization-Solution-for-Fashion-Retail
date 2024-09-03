import nodemailer from "nodemailer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sadeepmalaka2@gmail.com",
    pass: "bfxr wzmt jalb grxp", // Consider using environment variables for sensitive information
  },
});

// OTP storage
const otpMap = new Map(); // Key: email, Value: OTP

// Function to generate a 6-digit OTP
const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Controller to send OTP to the user's email
export const sendOTP = (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  const otp = generateOTP(); // Generate OTP
  otpMap.set(email, otp); // Store OTP for the email

  const mailOptions = {
    from: "sadeepmalaka2@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #000;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 150px;
          }
          .content {
            margin-bottom: 20px;
          }
          .otp {
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://firebasestorage.googleapis.com/v0/b/mern-tourism.appspot.com/o/Home-BG%2FLogo14.png?alt=media&token=0a278684-1f9b-42b3-9e3c-a40b9e6141c6" alt="Your Website Logo" />
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Thank you for signing up on Your Website. To complete your registration, please use the following OTP (One Time Password):</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best Regards,<br/>Your Website Team</p>
          </div>
        </div>
      </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email" });
    } else {
      console.log("Email sent: " + info.response);
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    }
  });
};

// Controller to verify OTP
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpMap.get(email);

  if (!storedOTP) {
    console.error("OTP not found for the email:", email);
    return res
      .status(400)
      .json({ success: false, message: "OTP not found for the email" });
  }

  if (otp !== storedOTP) {
    console.error("Invalid OTP:", otp);
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP is valid, proceed with account creation or any other action
  otpMap.delete(email); // Optional: remove OTP after successful verification
  res.status(200).json({ success: true, message: "OTP verified successfully" });
};
