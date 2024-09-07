// DiscountManagement.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import AddOffer from "../discount&offer/AddOffer";

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
      <AddOffer />
    </motion.div>
  );
}
