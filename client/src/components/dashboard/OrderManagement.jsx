import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Lottie from "lottie-react";
import animationData from "../../assets/img/worker-packing-the-goods.json";
import animationData1 from "../../assets/img/deliveryman-riding-scooter.json";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [dates, setDates] = useState([]);

  // const pData = [2, 1, 9, 3, 4, 3, 2];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await axios.get("http://localhost:3000/api/order/get");
        setOrders(data.data);

        const allDates = data.data.map((ord) => ord.createdAt.split("T")[0]);
        setDates((prevDates) => [...prevDates, ...allDates]);
        console.log(dates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const getTodayDay = (x) => {
    const today = new Date();
    today.setDate(today.getDate() - x);
    const options = {
      weekday: "long",
    };
    const formattedDate = today.toLocaleDateString("en-CA", options);
    console.log(formattedDate);
    return formattedDate;
  };

  const getDate = (x) => {
    const today = new Date();
    today.setDate(today.getDate() - x);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = today.toLocaleDateString("en-CA", options);
    const dayOrder = orders.filter((item) =>
      item.createdAt.split("T")[0].includes(formattedDate)
    );
    const lengths = dayOrder.length;
    return lengths;
  };

  const dddf = getDate(27);
  console.log(dddf);

  const xLabels = [
    getTodayDay(0),
    getTodayDay(1),
    getTodayDay(2),
    getTodayDay(3),
    getTodayDay(4),
    getTodayDay(5),
    getTodayDay(6),
  ];

  const uData = [
    getDate(0),
    getDate(1),
    getDate(2),
    getDate(3),
    getDate(4),
    getDate(5),
    getDate(6),
  ];
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

  useEffect(() => {
    const serchOrder = orders.filter((item) =>
      item.orderId.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredOrder(serchOrder);
  }, [searchValue, orders]);

  const openCard = (order) => {
    setIsModalOpen(true);
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <input
        type="text"
        placeholder="Search..."
        className="bg-SecondaryColor rounded-md p-2 w-64 outline-none mb-10"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex">
        <div>
          <h2>Monthly Orders</h2>
          <LineChart
            width={700}
            height={300}
            series={[
              // { data: pData, label: "pv" },
              { data: uData, label: "Daily Orders" },
            ]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
          />
        </div>
        <div>
          <h2 className="pb-5">Shipping Status</h2>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: orders.filter((item) => item.status === "Pending")
                      .length,
                    label: "Pending",
                  },
                  {
                    id: 1,
                    value: orders.filter((item) => item.status === "Delivered")
                      .length,
                    label: "Delivered",
                  },
                  {
                    id: 2,
                    value: orders.filter((item) => item.status === "Shipped")
                      .length,
                    label: "Shipped",
                  },
                ],
              },
            ]}
            width={400}
            height={250}
          />
        </div>
      </div>

      <div className=" p-8 rounded-lg ">
        <table className="min-w-full bg-white rounded-md shadow-xl">
          <thead className="bg-black rounded-md">
            <tr>
              <th className="p-4 text-left text-white">Order ID</th>
              <th className="p-4 text-left text-white">Customer</th>
              <th className="p-4 text-left text-white">Status</th>
              <th className="p-4 text-left text-white">Total</th>
              <th className="p-4 text-left text-white">Date</th>
              <th className="p-4 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrder.map((order) => (
              <tr key={order._id} className="hover:bg-slate-200">
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
                <td className="p-4">{order.createdAt.split("T")[0]}</td>
                <td className="p-4">
                  <button
                    className="bg-DarkColor text-white p-2 rounded hover:bg-ExtraDarkColor transition "
                    onClick={(e) => openCard(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="text-center items-center bg-white p-10 w-1/2 rounded-lg"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60"
        >
          <h2 className="mb-10 font-bold text-2xl"> Order Details</h2>
          <div className="p-10">
            <ProgressBar
              percent={
                selectedOrder.status === "Pending"
                  ? 0
                  : selectedOrder.status === "Shipped"
                  ? 50
                  : selectedOrder.status === "Delivered"
                  ? 100
                  : 0
              }
            >
              <Step>
                {({ accomplished, index }) => (
                  <div
                    className={`bg-black rounded-full h-14 w-20 ${
                      accomplished ? "accomplished" : null
                    }`}
                  >
                    <Lottie animationData={animationData} loop={true} />
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished, index }) => (
                  <div
                    className={`bg-black rounded-full h-14 w-20   ${
                      accomplished ? "accomplished" : null
                    }`}
                  >
                    <Lottie animationData={animationData1} loop={true} />
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished, index }) => (
                  <div
                    className={`bg-black rounded-full h-14 w-20  ${
                      accomplished ? "accomplished" : null
                    }`}
                  >
                    <Lottie animationData={animationData1} loop={true} />
                  </div>
                )}
              </Step>
            </ProgressBar>
            <div className="mt-20">
              <div className="flex gap-5">
                <h2>Order ID: {selectedOrder.orderId}</h2>
                <h2>Payment Method: {selectedOrder.paymentMethod}</h2>
                <h2>Total: {selectedOrder.total}</h2>
                <h2>Date: {selectedOrder.createdAt}</h2>
              </div>

              <div className="flex gap-5 mt-5">
                <h2>Order ID: {selectedOrder.orderId}</h2>
                <h2>Payment Method: {selectedOrder.paymentMethod}</h2>
                <h2>Total: {selectedOrder.orderId}</h2>
                <h2>Date: {selectedOrder.orderId}</h2>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </motion.div>
  );
}
