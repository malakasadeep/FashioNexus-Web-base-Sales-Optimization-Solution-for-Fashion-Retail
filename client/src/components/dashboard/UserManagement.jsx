// UserManagement.js
import React from "react";
import { motion } from "framer-motion";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];

export default function UserManagement() {
  return (
    <motion.div
      className=" p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        User Management
      </h1>
      <table className="min-w-full bg-SecondaryColor shadow-md rounded">
        <thead>
          <tr>
            <th className="p-4 text-left text-DarkColor">Name</th>
            <th className="p-4 text-left text-DarkColor">Email</th>
            <th className="p-4 text-left text-DarkColor">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-PrimaryColor">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
