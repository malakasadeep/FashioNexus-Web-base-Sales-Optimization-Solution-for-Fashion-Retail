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
    console.log(selectedOrder);
    console.log("Selected Order:", selectedOrder.customerInfo);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className=" p-5 bg-PrimaryColor min-h-screen ml-16"
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
            width={600}
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
          className="text-center bg-white p-10 w-3/4 max-w-4xl rounded-lg ml-20"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60"
        >
          {/* Modal Header */}
          <h2 className="mb-8 font-bold text-3xl">Order Details</h2>

          {/* Progress Bar */}
          <div className="w-full mb-10">
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
              filledBackground="linear-gradient(to right, #00A896, #028090)"
            >
              <Step>
                {({ accomplished }) => (
                  <div className="flex flex-col items-center">
                    <div
                      className={`bg-gray-300 rounded-full h-14 w-14 flex justify-center items-center ${
                        accomplished ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <Lottie
                        animationData={animationData}
                        loop={accomplished}
                        className="h-10 w-10"
                      />
                    </div>
                    <p className="mt-2 text-sm">Pending</p>
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className="flex flex-col items-center">
                    <div
                      className={`bg-gray-300 rounded-full h-14 w-14 flex justify-center items-center ${
                        accomplished ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <Lottie
                        animationData={animationData1}
                        loop={accomplished}
                        className="h-10 w-10"
                      />
                    </div>
                    <p className="mt-2 text-sm">Shipped</p>
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className="flex flex-col items-center">
                    <div
                      className={`bg-gray-300 rounded-full h-14 w-14 flex justify-center items-center ${
                        accomplished ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <Lottie
                        animationData={animationData1}
                        loop={accomplished}
                        className="h-10 w-10"
                      />
                    </div>
                    <p className="mt-2 text-sm">Delivered</p>
                  </div>
                )}
              </Step>
            </ProgressBar>
          </div>

          {/* Order Info */}
          <div className="p-6">
            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-5 text-left">
              <div>
                <h3 className="font-semibold">Order ID:</h3>
                <p>{selectedOrder.orderId}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Method:</h3>
                <p>{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Amount:</h3>
                <p>${selectedOrder.total}</p>
              </div>
              <div>
                <h3 className="font-semibold">Order Date:</h3>
                <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer and Delivery Info (Side by Side) */}
            <div className="mt-10 grid grid-cols-2 gap-5">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-xl mb-3">
                  Customer Information
                </h3>
                <div>
                  <h4 className="font-semibold">Customer Name:</h4>
                  <p>{selectedOrder.customerInfo.name || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Email:</h4>
                  <p>{selectedOrder.customerInfo.email || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Mobile:</h4>
                  <p>{selectedOrder.customerInfo.mobile || "N/A"}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="font-semibold text-xl mb-3">
                  Delivery Information
                </h3>
                <div>
                  <h4 className="font-semibold">Address:</h4>
                  <p>{selectedOrder.deliveryInfo.address || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">City:</h4>
                  <p>{selectedOrder.deliveryInfo.city || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Postal Code:</h4>
                  <p>{selectedOrder.deliveryInfo.postalCode || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-10">
              <h3 className="font-semibold text-xl mb-3">Ordered Items</h3>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Item</th>
                    <th className="py-2 px-4 border-b">Color</th>
                    <th className="py-2 px-4 border-b">Size</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{item.title}</td>
                      <td className="py-2 px-4 border-b">{item.color}</td>
                      <td className="py-2 px-4 border-b">{item.size}</td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="mt-10 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </Modal>
      </div>
    </motion.div>
  );
}
