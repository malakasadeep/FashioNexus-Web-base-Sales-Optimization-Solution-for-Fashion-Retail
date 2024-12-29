import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaTimes, FaGoogle } from "react-icons/fa";
import OAuth from "./OAuth";

export default function SignIn({ onClose, onSignUp }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignInChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInstart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message));
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
          confirmButtonColor: "#4A5568",
        });
        return;
      }

      dispatch(signInSuccess(data));
      onClose(); // Close the popup on successful login
      if (data.ismanager) {
        navigate("/manager");
      } else {
        navigate("/");
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login successful",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      dispatch(signInFailure(error.message));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        confirmButtonColor: "#4A5568",
      });
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
        >
          <motion.button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={24} />
          </motion.button>

          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Welcome Back
          </motion.h2>

          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <motion.div
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
            >
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-SecondaryColor"
                onChange={handleSignInChange}
                required
              />
            </motion.div>

            <motion.div
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
            >
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-SecondaryColor"
                onChange={handleSignInChange}
                required
              />
            </motion.div>

            <motion.button
              className="w-full py-2 px-4 bg-DarkColor text-white rounded-md font-semibold shadow-md hover:bg-ExtraDarkColor focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <motion.span
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  &#8987;
                </motion.span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              or login with
            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <OAuth />

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <motion.span
              className="text-DarkColor cursor-pointer hover:underline"
              onClick={onSignUp}
              whileHover={{ scale: 1.05 }}
            >
              Sign Up
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
