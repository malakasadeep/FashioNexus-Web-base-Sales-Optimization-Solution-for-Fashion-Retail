import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

const router = express.Router();

// Route to handle OTP sending
router.post("/sendotp", sendOTP);

// Route to handle OTP verification
router.post("/verifyotp", verifyOTP);

export default router;
