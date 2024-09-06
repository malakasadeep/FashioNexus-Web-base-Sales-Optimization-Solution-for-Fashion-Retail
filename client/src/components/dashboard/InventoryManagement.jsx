// InventoryManagement.js
import React from "react";
import { motion } from "framer-motion";
import AddFashionProduct from "../inventory/AddFashionProduct";

export default function InventoryManagement() {
  return (
    <motion.div
      className=" p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        Inventory Management
      </h1>
      <AddFashionProduct />
      {/* Add tables or other components for inventory management here */}
    </motion.div>
  );
}
