import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaDownload,
  FaUserPlus,
  FaTrash,
  FaUsers,
  FaUserTie,
  FaChartPie,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";
import AddUserPopup from "./AddUserPopup";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [reportType, setReportType] = useState("csv");
  const [userCounts, setUserCounts] = useState({
    total: 0,
    customers: 0,
    managers: 0,
  });
  const chartRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user/all-Users");
      setUsers(response.data);
      calculateUserCounts(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error!", "Failed to fetch users.", "error");
    }
  };

  const calculateUserCounts = (userData) => {
    const counts = {
      total: userData.length,
      customers: userData.filter((user) => user.usertype === "customer").length,
      managers: userData.filter((user) => user.ismanager).length,
    };
    setUserCounts(counts);
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

  const downloadPDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Header
    doc
      .setFont("helvetica", "normal")
      .setFontSize(28)
      .setTextColor(169, 132, 109);
    doc.text("FashioNexus", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(18).setTextColor(0, 0, 0);
    doc.text("User Details Report", 105, 30, { align: "center" });

    // Subheader
    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text("FashioNexus.co, Galle Road, Colombo, Sri Lanka", 105, 38, {
      align: "center",
    });

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 42, 190, 42);

    // Date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate}`, 20, 48);

    // User Count Cards
    const cardY = 60;
    const cardWidth = 50;
    const cardHeight = 25;
    const cardSpacing = 5;

    const drawCard = (x, y, title, count) => {
      doc.setFillColor(245, 235, 224); // Using custom colors
      doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "F");
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(0, 0, 0);
      doc.text(title, x + cardWidth / 2, y + 8, { align: "center" });
      doc.setFontSize(14).setTextColor(169, 132, 109);
      doc.text(count.toString(), x + cardWidth / 2, y + 20, {
        align: "center",
      });
    };

    // Example userCounts data
    const userCounts = { total: 5, customers: 4, managers: 1 };

    drawCard(20, cardY, "Total Users", userCounts.total);
    drawCard(
      20 + cardWidth + cardSpacing,
      cardY,
      "Customers",
      userCounts.customers
    );
    drawCard(
      20 + (cardWidth + cardSpacing) * 2,
      cardY,
      "Managers",
      userCounts.managers
    );

    // Generate Pie Chart image (assuming you have a reference to a chart, e.g., `chartRef`)
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current); // Requires html2canvas
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 70, 100, 90, 70);
    }

    // Add table with user data
    doc.autoTable({
      startY: cardY + cardHeight + 100,
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
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [212, 163, 115], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 235, 224] },
    });

    // Footer (Page numbering)
    const pageCount = doc.internal.getNumberOfPages();
    doc
      .setFont("helvetica", "normal")
      .setFontSize(8)
      .setTextColor(100, 100, 100);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save("FashioNexus_User_Report.pdf");
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

  const CountCard = ({ title, count, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 w-64"
    >
      <div className="bg-[#d4a373] p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </motion.div>
  );

  const UserDistributionChart = () => {
    const data = [
      { name: "Managers", value: userCounts.managers },
      { name: "Customers", value: userCounts.customers },
    ];
    const COLORS = ["#d4a373", "#a98467"];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] rounded-lg"
    >
      {/* Summary Cards and Chart */}
      <div className="md:grid md:grid-cols-3 gap-1 justify-center">
        {/* Column for Count Cards */}
        <div className="md:col-span-2 space-y-4">
          <CountCard
            title="Total Users"
            count={userCounts.total}
            icon={<FaUsers className="text-white text-2xl" />}
          />
          <CountCard
            title="Customers"
            count={userCounts.customers}
            icon={<FaUserTie className="text-white text-2xl" />}
          />
          <CountCard
            title="Managers"
            count={userCounts.managers}
            icon={<FaChartPie className="text-white text-2xl" />}
          />
        </div>

        {/* Column for User Distribution Chart */}
        <div className="md:col-span-1">
          <UserDistributionChart />
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4 mt-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full md:w-1/3"
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
          <button
            onClick={handleDownload}
            className="flex items-center bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#a98467] transition duration-300 shadow-md"
          >
            <FaDownload className="mr-2" />
            Download Report
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#a98467] transition duration-300 shadow-md"
          >
            <FaUserPlus className="mr-2" />
            Add User
          </button>
        </motion.div>
      </div>

      {/* User Table */}
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

      {/* Add User Popup */}
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
