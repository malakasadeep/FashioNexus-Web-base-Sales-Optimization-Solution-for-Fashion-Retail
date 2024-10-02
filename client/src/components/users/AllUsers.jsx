import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import AddUserPopup from "./AddUserPopup"; // Import AddUserPopup component

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control popup visibility

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user/all-Users"); // Adjust endpoint based on your backend route
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/users/delete/${id}`); // Adjust endpoint based on your backend route
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  // Download report as CSV
  const downloadReport = () => {
    const csvContent = [
      [
        "First Name",
        "Last Name",
        "Username",
        "Email",
        "User Type",
        "Is Manager",
      ],
      ...users.map((user) => [
        user.firstname,
        user.lastname,
        user.username,
        user.email,
        user.usertype,
        user.ismanager ? "Yes" : "No",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "users_report.csv");
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f5ebe0] text-[#775c41]">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <button
            onClick={downloadReport}
            className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467] mr-2"
          >
            Download Report
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)} // Open the Add User popup
            className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467]"
          >
            Add User
          </button>
        </div>
      </div>

      <table className="w-full bg-[#e3d5ca] rounded-md">
        <thead>
          <tr className="text-left border-b-2 border-[#d4a373]">
            <th className="p-2">Avatar</th>
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">User Type</th>
            <th className="p-2">Is Manager</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-b hover:bg-[#f5ebe0]">
              <td className="p-2">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-16 h-16 object-cover rounded-full"
                />
              </td>
              <td className="p-2">{user.firstname}</td>
              <td className="p-2">{user.lastname}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.usertype}</td>
              <td className="p-2">{user.ismanager ? "Yes" : "No"}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddUserOpen && (
        <AddUserPopup
          closePopup={() => setIsAddUserOpen(false)} // Close the popup
          refreshUsers={fetchUsers} // Refresh user list after adding a new user
        />
      )}
    </div>
  );
};

export default AllUsers;
