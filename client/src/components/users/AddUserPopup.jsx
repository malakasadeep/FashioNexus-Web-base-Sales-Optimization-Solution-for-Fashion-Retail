import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTie,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const AddUserPopup = ({ closePopup, refreshUsers }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    usertype: "customer",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email!",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#d4a373",
      });
      return;
    }

    if (formData.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Weak Password!",
        text: "Password must be at least 8 characters long.",
        confirmButtonColor: "#d4a373",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/add", {
        ...formData,
        ismanager: formData.usertype === "manager",
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User has been added successfully.",
        confirmButtonColor: "#d4a373",
      });
      refreshUsers();
      closePopup();
    } catch (error) {
      setLoading(false);
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error adding the user.",
        confirmButtonColor: "#d4a373",
      });
    }
  };

  const inputFields = [
    { name: "firstname", label: "First Name", icon: FaUser },
    { name: "lastname", label: "Last Name", icon: FaUser },
    { name: "username", label: "Username", icon: FaUser },
    { name: "email", label: "Email", type: "email", icon: FaEnvelope },
    { name: "password", label: "Password", type: "password", icon: FaLock },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#775c41]">Add New User</h2>
            <button
              onClick={closePopup}
              className="text-[#775c41] hover:text-[#d4a373] transition duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map((field) => (
              <div key={field.name} className="relative">
                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.label}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a373] transition duration-300"
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
            <div className="relative">
              <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="usertype"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a373] transition duration-300 appearance-none"
                value={formData.usertype}
                onChange={handleInputChange}
                required
              >
                <option value="customer">Customer</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-[#d4a373] text-white py-2 rounded-md hover:bg-[#a98467] transition duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaUser className="mr-2" />
              )}
              {loading ? "Adding User..." : "Add User"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddUserPopup;
