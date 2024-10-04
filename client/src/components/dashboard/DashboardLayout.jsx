// DashboardLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header"; // Add the Header component
import { Route, Routes } from "react-router-dom";
import DashboardOverview from "./Dashboard";
import UserManagement from "./UserManagement";
import InventoryManagement from "./InventoryManagement";
import OrderManagement from "./OrderManagement";
import DiscountManagement from "./DiscountManagement";
import SalesForecasting from "./SalesForcasting";
import Profile from "./Profile";
import CreateInventory from "../../pages/inventory/CreateInventory";
import AddOffer from "../discount&offer/AddOffer";
import UpdateOffer from "../discount&offer/UpdateOffer";

const contentVariants = {
  open: { marginLeft: 250, transition: { type: "spring", stiffness: 50 } },
  closed: { marginLeft: 0, transition: { type: "spring", stiffness: 50 } },
};

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative min-h-screen bg-PrimaryColor">
      {/* Toggle Button */}

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <motion.main
        className=" flex-1 ml-0 transition-all"
        variants={contentVariants}
        animate={isOpen ? "open" : "closed"}
      >
        <Header />

        {/* Routes for Dashboard Components */}
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route
            path="/inventory-management"
            element={<InventoryManagement />}
          />
          <Route
            path="/inventory-management/create"
            element={<CreateInventory />}
          />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route
            path="/discount-management/*"
            element={<DiscountManagement />}
          />
          <Route path="/add-discount" element={<AddOffer />} />
          <Route path="/update-discount/:id" element={<UpdateOffer />} />
          <Route path="/sales-forecasting" element={<SalesForecasting />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>
    </div>
  );
}
