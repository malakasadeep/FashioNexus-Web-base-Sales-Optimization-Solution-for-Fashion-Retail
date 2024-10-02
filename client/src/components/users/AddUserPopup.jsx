import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddUserPopup = ({ closePopup, refreshUsers }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    usertype: "customer",
    ismanager: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ismanager:
        name === "usertype" && value === "manager" ? true : formData.ismanager,
    });
  };

  const handleAvatarChange = (e) => {
    setFormData({ ...formData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/add", formData); // Adjust endpoint based on your backend route
      Swal.fire("Success!", "User has been added successfully.", "success");
      refreshUsers(); // Refresh user list
      closePopup(); // Close popup
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire("Error!", "There was an error adding the user.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#e3d5ca] p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-[#775c41]">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">First Name</label>
            <input
              type="text"
              name="firstname"
              className="w-full p-2 border rounded"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">Last Name</label>
            <input
              type="text"
              name="lastname"
              className="w-full p-2 border rounded"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-[#775c41]">User Type</label>
            <select
              name="usertype"
              className="w-full p-2 border rounded"
              value={formData.usertype}
              onChange={handleInputChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467] mr-2"
              onClick={closePopup}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467]"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
