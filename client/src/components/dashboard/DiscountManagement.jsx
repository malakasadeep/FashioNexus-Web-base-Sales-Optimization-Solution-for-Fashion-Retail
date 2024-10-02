// DiscountManagement.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import AddOffer from "../discount&offer/AddOffer";
import DiscountTable from "../discount&offer/ExistingDiscounts";
import UpdateOffer from "../discount&offer/UpdateOffer";

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
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [newDiscount, setNewDiscount] = useState({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const handleAddDiscount = () => {
    setDiscounts([...discounts, { ...newDiscount, id: discounts.length + 1 }]);
    setNewDiscount({ name: "", discount: "", startDate: "", endDate: "" });
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
      <Routes>
        <Route path="/" element={<DiscountTable />} />
        <Route path="/add" element={<AddOffer />} />
        <Route path="/update/:id" element={<UpdateOffer />} />
      </Routes>
    </motion.div>
  );
}
