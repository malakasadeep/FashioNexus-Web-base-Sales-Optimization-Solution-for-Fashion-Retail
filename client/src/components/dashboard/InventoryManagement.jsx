// InventoryManagement.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InventoryManagementAll from "../inventory/InventoryManagementAll";
import CreateInventory from "../../pages/inventory/CreateInventory";

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("all"); // State to manage active tab

  // Tab content variants for animations
  const tabVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return <InventoryManagementAll />;
      case "add":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Replace with your View Items component */}
            <CreateInventory />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="p-10 pl-16 pr-1 min-h-screen"
      style={{ backgroundColor: "#f5ebe0" }} // PrimaryColor for background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "#a98467" }} // ExtraDarkColor for the main heading
      >
        Inventory Management
      </h1>

      {/* Tab Navigation */}
      <div
        className="flex space-x-4 border-b-2 mb-4"
        style={{ borderColor: "#e3d5ca" }} // SecondaryColor for the border
      >
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "all" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "all" ? "#d4a373" : "transparent", // DarkColor for active tab border
            color: activeTab === "all" ? "#d4a373" : "#a98467", // DarkColor for active tab text, ExtraDarkColor for inactive
          }}
          onClick={() => setActiveTab("all")}
        >
          Manage All Items
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "add" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "add" ? "#d4a373" : "transparent",
            color: activeTab === "add" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("add")}
        >
          Add Item
        </div>
      </div>

      {/* Render Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab} // Ensure that the content changes with the tab
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }} // Customize duration for smooth transition
          className="mt-4"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
