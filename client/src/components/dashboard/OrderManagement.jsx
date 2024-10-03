// OrderManagement.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await axios.get("http://localhost:3000/api/order/get");
        setOrders(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `http://localhost:3000/api/order/status/${id}`,
            { status: newStatus }
          );
          Swal.fire("Saved!", "", "success");
          window.location.reload();
        } catch (error) {
          console.log(error);
          Swal.fire("Error saving changes", "", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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
              <tr key={order._id} className="hover:bg-PrimaryColor">
                <td className="p-4">{order.orderId}</td>
                <td className="p-4">{order.customerInfo.name}</td>
                <td className="p-4">
                  <select
                    className="p-2 bg-PrimaryColor rounded"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-4">{order.total}</td>
                <td className="p-4">{order.createdAt}</td>
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
