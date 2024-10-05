import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaDownload,
  FaUserPlus,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Pie } from "react-chartjs-2";
import AddUserPopup from "./AddUserPopup";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [reportType, setReportType] = useState("csv");

  // For pie chart data
  const managerCount = users.filter((user) => user.ismanager).length;
  const customerCount = users.length - managerCount;

  const pieData = {
    labels: ["Managers", "Customers"],
    datasets: [
      {
        label: "# of Users",
        data: [managerCount, customerCount],
        backgroundColor: ["#d4a373", "#a98467"],
        hoverBackgroundColor: ["#e3d5ca", "#f5ebe0"],
      },
    ],
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user/all-Users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error!", "Failed to fetch users.", "error");
    }
  };

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
        await axios.delete(`/api/user/delete-user/${id}`);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      [
        "First Name",
        "Last Name",
        "Username",
        "Email",
        "User Type",
        "Is Manager",
      ],
      ...filteredUsers.map((user) => [
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "First Name",
          "Last Name",
          "Username",
          "Email",
          "User Type",
          "Is Manager",
        ],
      ],
      body: filteredUsers.map((user) => [
        user.firstname,
        user.lastname,
        user.username,
        user.email,
        user.usertype,
        user.ismanager ? "Yes" : "No",
      ]),
    });
    doc.save("users_report.pdf");
  };

  const handleDownload = () => {
    if (reportType === "csv") {
      downloadCSV();
    } else {
      downloadPDF();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 30 },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableCol: {
      width: "16.6%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Users Report</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {[
              "First Name",
              "Last Name",
              "Username",
              "Email",
              "User Type",
              "Is Manager",
            ].map((header, index) => (
              <View key={index} style={styles.tableCol}>
                <Text style={styles.tableCell}>{header}</Text>
              </View>
            ))}
          </View>
          {filteredUsers.map((user) => (
            <View style={styles.tableRow} key={user._id}>
              {[
                "firstname",
                "lastname",
                "username",
                "email",
                "usertype",
                user.ismanager ? "Yes" : "No",
              ].map((field, index) => (
                <View key={index} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user[field]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] rounded-lg"
    >
      {/* Count Cards */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex w-full md:w-1/3"
        >
          <div className="flex space-x-4 w-full">
            {/* Total Users Card */}
            <motion.div
              className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FaUsers className="text-[#d4a373] mr-3 text-3xl" />
                <div>
                  <p className="text-lg font-semibold">Total Users</p>
                  <p className="text-gray-500">{users.length}</p>
                </div>
              </div>
            </motion.div>

            {/* Customers Card */}
            <motion.div
              className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FaUser className="text-[#d4a373] mr-3 text-3xl" />
                <div>
                  <p className="text-lg font-semibold">Customers</p>
                  <p className="text-gray-500">{customerCount}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-4"
        >
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          {reportType === "pdf" ? (
            <PDFDownloadLink
              document={<MyDocument />}
              fileName="users_report.pdf"
            >
              {({ loading }) => (
                <button
                  className="flex items-center bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#a98467] transition duration-300 shadow-md"
                  disabled={loading}
                >
                  <FaDownload className="mr-2" />
                  {loading ? "Loading document..." : "Download Report"}
                </button>
              )}
            </PDFDownloadLink>
          ) : (
            <button
              onClick={handleDownload}
              className="flex items-center bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#a98467] transition duration-300 shadow-md"
            >
              <FaDownload className="mr-2" />
              Download Report
            </button>
          )}
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#a98467] transition duration-300 shadow-md"
          >
            <FaUserPlus className="mr-2" />
            Add User
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="overflow-x-auto rounded-lg shadow-lg"
      >
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-[#d4a373] text-white">
              <th className="p-3">Avatar</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">User Type</th>
              <th className="p-3">Is Manager</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b hover:bg-[#f5ebe0] transition duration-300"
                >
                  <td className="p-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="p-3">{user.firstname}</td>
                  <td className="p-3">{user.lastname}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.usertype}</td>
                  <td className="p-3">{user.ismanager ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pie Chart at Bottom Right */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-end mt-6"
      >
        <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
          <Pie data={pieData} />
        </div>
      </motion.div>

      {isAddUserOpen && (
        <AddUserPopup
          closePopup={() => setIsAddUserOpen(false)}
          refreshUsers={fetchUsers}
        />
      )}
    </motion.div>
  );
};

export default AllUsers;
