import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routs.js";
import discountRouter from "./routes/discount.route.js";
import orderRouter from "./routes/order.rout.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

//dewni
import inventoryRouter from "./routes/inventory.routs.js";

//shadini
import promotionRouter from "./routes/promotion.routes.js";

dotenv.config();
const MONGODB_URL =
  "mongodb+srv://pgmsadeep:1234@cluster0.phudmlq.mongodb.net/fashion?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to Mongo DB successfully!!!");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo");
  });

const app = express();

//
app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://fashio-nexus.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.listen(3000, () => {
  console.log("Server listening on port 3000!!!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Create 'uploads' directory if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Route to handle image uploads
app.post("/api/upload", upload.array("images", 3), (req, res) => {
  const filePaths = req.files.map((file) => `uploads/${file.filename}`);
  res.json({ filePaths });
});

const __dirname = dirname(fileURLToPath(import.meta.url)); // Get directory name

app.use("/uploads", express.static(join(__dirname, "uploads")));

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);
app.use("/api/discount", discountRouter);
app.use("/api/order", orderRouter);
// Use OTP routes

//dewni
app.use("/api/inventories", inventoryRouter);

// Use OTP routes
//promotion routes
app.use("/api/promotions", promotionRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sadeepmalaka2@gmail.com",
    pass: "bfxr wzmt jalb grxp",
  },
});

// OTP Storage
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

// Route to send OTP
app.post("/api/auth/sendotp", (req, res) => {
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
      console.error("Error sending OTP:", error);
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
});

// Route to verify OTP
app.post("/api/auth/verifyotp", (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpMap.get(email);

  if (!storedOTP) {
    return res
      .status(400)
      .json({ success: false, message: "OTP not found for the email" });
  }

  if (otp !== storedOTP) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP is valid
  otpMap.delete(email); // Optional: Remove OTP after successful verification
  res.status(200).json({ success: true, message: "OTP verified successfully" });
});
