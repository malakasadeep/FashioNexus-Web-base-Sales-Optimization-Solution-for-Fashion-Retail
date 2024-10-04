import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

export default function OtpValidationPopup({ onClose, onVerifyOtp }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value) || value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter a valid 6-digit OTP.",
        confirmButtonColor: "#4A5568",
      });
      return;
    }
    setLoading(true);
    try {
      await onVerifyOtp(otpString);
      Swal.fire({
        icon: "success",
        title: "OTP Verified",
        text: "Your OTP has been successfully verified.",
        confirmButtonColor: "#4A5568",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: "Failed to verify OTP. Please try again.",
        confirmButtonColor: "#4A5568",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-2/3 max-w-md p-8 bg-white rounded-lg shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <FaTimes size={24} />
          </button>
          <div className="flex items-center justify-center mb-6">
            <FaLock size={32} className="text-blue-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800">Verify OTP</h2>
          </div>
          <p className="text-center text-gray-600 mb-6">
            Enter the 6-digit code sent to your device
          </p>
          <div className="flex justify-center mb-8 space-x-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="1"
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
          <motion.button
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md font-semibold text-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleVerify}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" size={24} />
            ) : (
              "Verify OTP"
            )}
          </motion.button>
          <p className="mt-4 text-center text-gray-600">
            Didn't receive the code?{" "}
            <button className="text-blue-500 hover:underline focus:outline-none">
              Resend OTP
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
