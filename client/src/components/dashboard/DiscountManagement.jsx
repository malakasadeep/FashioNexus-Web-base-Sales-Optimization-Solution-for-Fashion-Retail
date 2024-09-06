import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemTable from "../disc&offer/ItemTable";
import DiscountTable from "../disc&offer/DiscountTable";

export default function DiscountManagement() {
  const [activeTab, setActiveTab] = useState("discountDashboard"); // State to manage active tab
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [offers, setOffers] = useState([]);

  // Tab content variants for animations
  const tabVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "discountDashboard":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          ></motion.div>
        );
      case "addDiscount":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ItemTable />
          </motion.div>
        );
      case "existingDiscounts":
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
      case "addOffer":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          ></motion.div>
        );
      case "existingOffers":
        return (
          <motion.div
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          ></motion.div>
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
        Discount & Offer Management
      </h1>

      {/* Tab Navigation */}
      <div
        className="flex space-x-4 border-b-2 mb-4"
        style={{ borderColor: "#e3d5ca" }} // SecondaryColor for the border
      >
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "discountDashboard" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor:
              activeTab === "discountDashboard" ? "#d4a373" : "transparent", // DarkColor for active tab border
            color: activeTab === "discountDashboard" ? "#d4a373" : "#a98467", // DarkColor for active tab text, ExtraDarkColor for inactive
          }}
          onClick={() => setActiveTab("discountDashboard")}
        >
          Dashboard
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "addDiscount" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor:
              activeTab === "addDiscount" ? "#d4a373" : "transparent",
            color: activeTab === "addDiscount" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("addDiscount")}
        >
          Add Discount
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "existingDiscounts" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor:
              activeTab === "existingDiscounts" ? "#d4a373" : "transparent",
            color: activeTab === "existingDiscounts" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("existingDiscounts")}
        >
          Existing Discounts
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "addOffer" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor: activeTab === "addOffer" ? "#d4a373" : "transparent",
            color: activeTab === "addOffer" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("addOffer")}
        >
          Add Offer
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "existingOffers" ? "border-b-4" : "text-gray-500"
          }`}
          style={{
            borderColor:
              activeTab === "existingOffers" ? "#d4a373" : "transparent",
            color: activeTab === "existingOffers" ? "#d4a373" : "#a98467",
          }}
          onClick={() => setActiveTab("existingOffers")}
        >
          Existing Offers
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
