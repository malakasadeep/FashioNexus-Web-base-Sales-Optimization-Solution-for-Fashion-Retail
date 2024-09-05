import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountTable from "../disc&offer/DiscountTable";
import ItemTable from "../disc&offer/ItemTable";

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [activeTab, setActiveTab] = useState("discount"); // State for active tab

  // Fetch discounts from API when the component mounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("/api/discount/get");
        if (!response.ok) {
          throw new Error("Failed to fetch discounts");
        }
        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleAddDiscount = (newDiscount) => {
    setDiscounts([...discounts, { ...newDiscount, id: discounts.length + 1 }]);
  };

  const handleDeleteDiscount = (id) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const handleUpdateDiscount = (discount) => {
    console.log("Updating discount:", discount);
  };

  const handleGenerateReport = () => {
    console.log("Generating report...");
  };

  return (
    <motion.div
      className="p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        Discount & Offer Management
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <motion.button
          className={`py-2 px-4 font-semibold rounded-lg ${
            activeTab === "discount"
              ? "bg-ExtraDarkColor text-white"
              : "bg-SecondaryColor text-DarkColor"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("discount")}
        >
          Discount
        </motion.button>
        <motion.button
          className={`py-2 px-4 font-semibold rounded-lg ${
            activeTab === "offers"
              ? "bg-ExtraDarkColor text-white"
              : "bg-SecondaryColor text-DarkColor"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("offers")}
        >
          Offers
        </motion.button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "discount" && (
            <motion.div
              key="discount"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Discount Table and Item Table in Discount Tab */}
              <DiscountTable
                discounts={discounts}
                onAddDiscount={handleAddDiscount}
                onDelete={handleDeleteDiscount}
                onUpdate={handleUpdateDiscount}
                onGenerateReport={handleGenerateReport}
              />
              <ItemTable />
            </motion.div>
          )}

          {activeTab === "offers" && (
            <motion.div
              key="offers"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add content for Offers tab here */}
              <h2 className="text-2xl font-bold text-DarkColor mb-4">
                Offers Content Here
              </h2>
              {/* Add your offers table or other content */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
