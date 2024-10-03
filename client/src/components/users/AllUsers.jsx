import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaDownload, FaUserPlus, FaTrash } from "react-icons/fa";
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
import AddUserPopup from "./AddUserPopup";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [reportType, setReportType] = useState("csv");

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
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>First Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Last Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Username</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>User Type</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Is Manager</Text>
            </View>
          </View>
          {filteredUsers.map((user) => (
            <View style={styles.tableRow} key={user._id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{user.firstname}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{user.lastname}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{user.username}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{user.email}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{user.usertype}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {user.ismanager ? "Yes" : "No"}
                </Text>
              </View>
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
      className="p-6 bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full md:w-1/3 mb-4 md:mb-0"
        >
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-3 pl-10 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
              {({ blob, url, loading, error }) => (
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
