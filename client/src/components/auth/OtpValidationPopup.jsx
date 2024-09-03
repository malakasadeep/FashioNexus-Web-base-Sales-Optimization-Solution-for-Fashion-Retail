import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import SpinnerButton from "../btns/SpinnerButton"; // Make sure SpinnerButton is correctly imported

export default function OtpValidationPopup({ onClose, onVerifyOtp }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value) || value.length > 1) return; // Ensure only single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus the next input box
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Swal.fire("Error", "Please enter a valid 6-digit OTP.", "error");
      return;
    }
    setLoading(true);
    onVerifyOtp(otpString).finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-96
       max-w-sm p-6 bg-SecondaryColor rounded-md shadow-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black transition duration-200"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-ExtraDarkColor mb-5">
          Verify OTP
        </h2>
        <div className="flex justify-center mb-6 space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-DarkColor"
              maxLength="1"
            />
          ))}
        </div>
        <div className="flex justify-between">
          <button
            className={`w-full p-2 mt-3 rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-DarkColor hover:bg-DarkColor-dark"
            } text-white`}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
