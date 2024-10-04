// InventoryManagement.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SalesPrediction from "../SalesForecasting/SalesPrediction";
import ManualPrediction from "../SalesForecasting/ManualPrediction";
// import SalesPrediction from "../inventory/ViewItems";

export default function SalesForcasting() {
  const [activeTab, setActiveTab] = useState("auto"); // State to manage active tab

  // Tab content variants for animations
  const tabVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "auto":
        return <SalesPrediction />;
      case "manual":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Replace with your View Items component */}
            <ManualPrediction />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="p-10 pl-20 min-h-screen"
      style={{ backgroundColor: "#f5ebe0" }} // PrimaryColor for background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="text-4xl font-bold mb-2"
        style={{ color: "#a98467" }} // ExtraDarkColor for the main heading
      >
        Sales Forcasting System
      </h1>

      {/* Tab Navigation */}
      <div
        className="flex space-x-4 border-b-2 mb-4"
        style={{ borderColor: "#e3d5ca" }} // SecondaryColor for the border
      >
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "auto" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "auto" ? "#d4a373" : "transparent", // DarkColor for active tab border
            color: activeTab === "auto" ? "#d4a373" : "#a98467", // DarkColor for active tab text, ExtraDarkColor for inactive
          }}
          onClick={() => setActiveTab("auto")}
        >
          Auto Forecast
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "manual" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "manual" ? "#d4a373" : "transparent",
            color: activeTab === "manual" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("manual")}
        >
          Manual Forecast
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
