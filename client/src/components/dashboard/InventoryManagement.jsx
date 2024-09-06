// InventoryManagement.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddFashionProduct from "../inventory/AddFashionProduct";
import ViewItems from "../inventory/ViewItems";

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("addItem"); // State to manage active tab

  // Tab content variants for animations
  const tabVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "addItem":
        return <AddFashionProduct />;
      case "viewItems":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Replace with your View Items component */}
            <ViewItems />
          </motion.div>
        );
      case "itemOverview":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Replace with your Item Overview component */}
            <p>Item Overview Component</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="p-10 min-h-screen"
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
            activeTab === "addItem" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "addItem" ? "#d4a373" : "transparent", // DarkColor for active tab border
            color: activeTab === "addItem" ? "#d4a373" : "#a98467", // DarkColor for active tab text, ExtraDarkColor for inactive
          }}
          onClick={() => setActiveTab("addItem")}
        >
          Add Item
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "viewItems" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "viewItems" ? "#d4a373" : "transparent",
            color: activeTab === "viewItems" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("viewItems")}
        >
          View Items
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "itemOverview" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor:
              activeTab === "itemOverview" ? "#d4a373" : "transparent",
            color: activeTab === "itemOverview" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("itemOverview")}
        >
          Item Overview
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
