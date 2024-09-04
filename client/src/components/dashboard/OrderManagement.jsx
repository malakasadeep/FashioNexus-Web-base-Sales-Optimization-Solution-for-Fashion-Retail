// OrderManagement.js
import React, { useState } from "react";
import { motion } from "framer-motion";

const initialOrders = [
  {
    id: "001",
    customer: "Alice Smith",
    status: "Pending",
    total: "$120.00",
    date: "2024-09-01",
  },
  {
    id: "002",
    customer: "Bob Johnson",
    status: "Shipped",
    total: "$75.00",
    date: "2024-09-02",
  },
  {
    id: "003",
    customer: "Charlie Brown",
    status: "Delivered",
    total: "$200.00",
    date: "2024-09-03",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <motion.div
      className=" p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        Order Management
      </h1>
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
        <table className="min-w-full bg-PrimaryColor shadow-md rounded">
          <thead>
            <tr>
              <th className="p-4 text-left text-DarkColor">Order ID</th>
              <th className="p-4 text-left text-DarkColor">Customer</th>
              <th className="p-4 text-left text-DarkColor">Status</th>
              <th className="p-4 text-left text-DarkColor">Total</th>
              <th className="p-4 text-left text-DarkColor">Date</th>
              <th className="p-4 text-left text-DarkColor">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-PrimaryColor">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">
                  <select
                    className="p-2 bg-PrimaryColor rounded"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-4">{order.total}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">
                  <button className="bg-DarkColor text-white p-2 rounded hover:bg-ExtraDarkColor transition">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
