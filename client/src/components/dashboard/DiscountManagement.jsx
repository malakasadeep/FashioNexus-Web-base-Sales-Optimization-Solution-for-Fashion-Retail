import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import AddOffer from "../discount&offer/AddOffer";
import DiscountTable from "../discount&offer/ExistingDiscounts";
import UpdateOffer from "../discount&offer/UpdateOffer";
import ItemsforDiscount from "../discount&offer/ItemsforDiscount";

const initialDiscounts = [
  {
    id: 1,
    name: "New Year Sale",
    discount: "20%",
    startDate: "2024-01-01",
    endDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Summer Special",
    discount: "15%",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
  },
];

export default function DiscountManagement() {
  // State to manage active tab
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialTab = query.get("tab") || "product"; // Default to "product" if no query param

  const [activeTab, setActiveTab] = useState(initialTab);

  // Tab content variants for animations
  const tabVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "product":
        return <ItemsforDiscount />;
      case "discounts":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DiscountTable />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Animation for each tab button hover
  const tabHoverEffect = {
    hover: { scale: 1.1, color: "#d4a373", transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  // Staggered list items effect for content inside the tabs
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      <motion.div
        className="p-10 pl-20 min-h-screen"
        style={{ backgroundColor: "#f5ebe0" }} // PrimaryColor for background
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-2"
          style={{ color: "#a98467" }} // ExtraDarkColor for the main heading
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Discount and Offer Management
        </motion.h1>

        {/* Tab Navigation */}
        <div
          className="flex space-x-4 border-b-2 mb-4"
          style={{ borderColor: "#e3d5ca" }} // SecondaryColor for the border
        >
          <motion.div
            className={`cursor-pointer px-4 py-2 -mb-1 ${
              activeTab === "product" ? "border-b-4" : "text-gray-500"
            }`}
            style={{
              borderColor: activeTab === "product" ? "#d4a373" : "transparent", // DarkColor for active tab border
              color: activeTab === "product" ? "#d4a373" : "#a98467", // DarkColor for active tab text, ExtraDarkColor for inactive
            }}
            onClick={() => setActiveTab("product")}
            variants={tabHoverEffect}
            whileHover="hover"
            whileTap="tap"
          >
            Items for Discount
          </motion.div>

          <motion.div
            className={`cursor-pointer px-4 py-2 -mb-1 ${
              activeTab === "discounts" ? "border-b-4" : "text-gray-500"
            }`}
            style={{
              borderColor:
                activeTab === "discounts" ? "#d4a373" : "transparent",
              color: activeTab === "discounts" ? "#d4a373" : "#a98467",
            }}
            onClick={() => setActiveTab("discounts")}
            variants={tabHoverEffect}
            whileHover="hover"
            whileTap="tap"
          >
            Existing Discount
          </motion.div>
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
            <motion.div variants={contentVariants}>
              {renderTabContent()}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
