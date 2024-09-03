import React, { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import OtpValidationPopup from "./OtpValidationPopup"; // Ensure this component is correctly imported

export default function SignUp({ onClose, onSignIn }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      Swal.fire(
        "Invalid Email",
        "Please enter a valid email address.",
        "error"
      );
      return false;
    }
    if (formData.password.length < 8) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 8 characters long.",
        "error"
      );
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      Swal.fire("Password Mismatch", "Passwords do not match.", "error");
      return false;
    }
    return true;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (!validateForm()) return; // Validation errors will stop here

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          setIsOtpModalOpen(true);
          Swal.fire("OTP sent!", "Check your email for the OTP.", "success");
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } else {
        const errorText = await response.text();
        Swal.fire("Error", `Unexpected response format: ${errorText}`, "error");
      }
    } catch (error) {
      Swal.fire("Error", `Sign Up Error: ${error.message}`, "error");
      console.error("Sign Up Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          await handleSignUp();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } else {
        const errorText = await res.text();
        Swal.fire("Error", `Unexpected response format: ${errorText}`, "error");
      }
    } catch (error) {
      Swal.fire("Error", `Verification Error: ${error.message}`, "error");
      console.error("Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data != null) {
        Swal.fire(
          "Success",
          "Your profile was created successfully!",
          "success"
        ).then(() => {
          onClose(); // Close modal only on success
          onSignIn();
        });
        setIsOtpModalOpen(false);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", `Registration Error: ${error.message}`, "error");
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-SecondaryColor p-8 rounded-lg shadow-lg w-1/3 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black transition duration-200"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-ExtraDarkColor mb-5">
          Sign Up
        </h2>
        <form onSubmit={handleSignUpSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={formData.repeatPassword}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <div className="">
            <button
              className={`w-full p-2 mt-3 rounded ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-DarkColor hover:bg-DarkColor-dark"
              } text-white`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <p className="mt-5 text-center">
              Already have an account?{" "}
              <span
                onClick={onSignIn}
                className="text-DarkColor cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </motion.div>
      {isOtpModalOpen && (
        <OtpValidationPopup
          onClose={() => setIsOtpModalOpen(false)}
          onVerifyOtp={handleVerifyOtp}
        />
      )}
    </motion.div>
  );
}
