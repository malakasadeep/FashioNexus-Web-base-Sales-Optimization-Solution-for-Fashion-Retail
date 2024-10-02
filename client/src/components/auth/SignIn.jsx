import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion for animations

export default function SignIn({ onClose, onSignUp }) {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const handleSignInChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInstart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(), // Convert email to lowercase
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log(data); // Debugging

      if (!res.ok) {
        dispatch(signInFailure(data.message));
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${data.message}`,
        });
        return;
      }

      dispatch(signInSuccess(data));
      if (data.ismanager === true) {
        navigation("/manager");
      } else {
        navigation("/");
        onClose;
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      dispatch(signInFailure(error.message));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-SecondaryColor p-8 rounded-lg shadow-lg w-1/3 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-ExtraDarkColor mb-5">
            Sign In
          </h2>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            onChange={handleSignInChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            onChange={handleSignInChange}
          />
          <button
            className={`w-full p-2 mt-3 rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-DarkColor hover:bg-DarkColor-dark"
            } text-white`}
            onClick={handleSignInSubmit}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <button className="w-full p-2 mt-3 bg-red-600 text-white rounded hover:bg-red-700">
            Sign In with Google
          </button>
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              onClick={onSignUp}
              className="text-DarkColor cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500"
          >
            &times;
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
