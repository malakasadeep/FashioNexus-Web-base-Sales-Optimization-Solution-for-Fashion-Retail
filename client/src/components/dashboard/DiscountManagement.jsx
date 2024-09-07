// DiscountManagement.js
import React, { useState } from "react";
import { motion } from "framer-motion";

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
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold text-DarkColor mb-4">
          Existing Discounts
        </h2>
        <table className="min-w-full bg-PrimaryColor shadow-md rounded">
          <thead>
            <tr>
              <th className="p-4 text-left text-DarkColor">Name</th>
              <th className="p-4 text-left text-DarkColor">Discount</th>
              <th className="p-4 text-left text-DarkColor">Start Date</th>
              <th className="p-4 text-left text-DarkColor">End Date</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((offer) => (
              <tr key={offer.id} className="hover:bg-PrimaryColor">
                <td className="p-4">{offer.name}</td>
                <td className="p-4">{offer.discount}</td>
                <td className="p-4">{offer.startDate}</td>
                <td className="p-4">{offer.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-DarkColor mb-4">
          Add New Offer
        </h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Offer Name"
            className="p-3 bg-PrimaryColor rounded"
            value={newDiscount.name}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Discount Percentage"
            className="p-3 bg-PrimaryColor rounded"
            value={newDiscount.discount}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, discount: e.target.value })
            }
          />
          <input
            type="date"
            className="p-3 bg-PrimaryColor rounded"
            value={newDiscount.startDate}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="p-3 bg-PrimaryColor rounded"
            value={newDiscount.endDate}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, endDate: e.target.value })
            }
          />
          <button
            className="bg-DarkColor text-white p-3 rounded mt-4 hover:bg-ExtraDarkColor transition"
            onClick={handleAddDiscount}
          >
            Add Offer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
