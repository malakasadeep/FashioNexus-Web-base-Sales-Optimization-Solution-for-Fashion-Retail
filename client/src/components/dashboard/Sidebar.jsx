// Sidebar.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaClipboardList,
  FaTags,
  FaChartLine,
  FaUserCircle,
} from "react-icons/fa";

const sidebarVariants = {
  open: {
    width: "250px",
    transition: { type: "spring", stiffness: 50 },
  },
  closed: {
    width: "0px",
    transition: { type: "spring", stiffness: 50 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.3 } },
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const menuItems = [
    { name: "Dashboard", path: "/manager", icon: <FaChartLine /> },
    {
      name: "Users",
      path: "/manager/user-management",
      icon: <FaUsers />,
    },
    {
      name: "Inventory",
      path: "/manager/inventory-management",
      icon: <FaBox />,
    },
    {
      name: "Orders",
      path: "/manager/order-management",
      icon: <FaClipboardList />,
    },
    {
      name: "Discount & Offers",
      path: "/manager/discount-management",
      icon: <FaTags />,
    },
    {
      name: "Sales Forecasting",
      path: "/manager/sales-forecasting",
      icon: <FaChartLine />,
    },
    { name: "Profile", path: "/manager/profile", icon: <FaUserCircle /> },
  ];

  return (
    <motion.aside
      className="bg-SecondaryColor h-screen fixed left-0 top-0 shadow-lg overflow-hidden z-20"
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        className="p-4"
        variants={contentVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <h2 className="text-2xl font-bold text-ExtraDarkColor mb-8 mt-10">
          Dashboard
        </h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center text-DarkColor p-2 rounded-lg hover:text-ExtraDarkColor hover:bg-DarkColor transition-colors duration-300 ${
                  selected === item.path
                    ? "bg-PrimaryColor text-DarkColor "
                    : ""
                }`}
                onClick={() => setSelected(item.path)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.aside>
  );
}
