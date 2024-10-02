import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import LoadingSpinner from "../../components/Spinner";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EditOrderPopup from "./EditOrderPopup";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const userId = "user001"; // Replace with dynamic userId

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/order/get/${userId}`);
        setOrders(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setShowEditPopup(true);
  };

  const handleDeleteOrder = async (orderId) => {
    // Show confirmation dialog before deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Proceed with deletion if the user confirms
      try {
        await axios.delete(`/api/order/delete/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        Swal.fire("Deleted!", "Your order has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete order", "error");
      }
    }
  };

  const handleDownloadBill = (order) => {
    Swal.fire("Info", "Bill download functionality coming soon!", "info");
  };

  const handleToggleExpand = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-8 w-full lg:w-3/4 mx-auto ">
        <h1 className="text-3xl font-bold mb-6 mt-20">My Orders</h1>
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative"
                >
                  {/* Order ID */}
                  <h2 className="text-xl font-semibold mb-2">
                    Order ID: {order.orderId}
                  </h2>

                  {/* Default View */}
                  <div>
                    <p className="text-gray-600">Status: {order.status}</p>
                    <p className="text-gray-600 mt-2">
                      Order Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-4 mt-4">
                      {order.items.map((item) => (
                        <div
                          key={item.itemId}
                          className="text-center flex flex-col items-center"
                        >
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                          <p className="text-gray-700 font-medium mt-2">
                            {item.title}
                          </p>
                          <p className="text-gray-600">Size: {item.size}</p>
                          <p className="text-gray-600">Color: {item.color}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-800 font-semibold mt-4">
                      Total Cost: $
                      {order.items
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>

                  {/* Expanded View */}
                  {expandedOrders[order._id] && (
                    <div className="mt-4">
                      <div className="flex flex-row items-start justify-between gap-8 border-t pt-4">
                        {/* Items Section */}
                        <div className="flex-1 pr-4 border-r border-gray-300">
                          <h3 className="text-lg font-semibold mb-2">Items:</h3>
                          <ul className="list-disc pl-5 mb-2">
                            {order.items.map((item) => (
                              <li key={item.itemId} className="text-gray-700">
                                {item.title} - Size: {item.size} - Color:{" "}
                                {item.color} - Qty: {item.quantity} - Price: $
                                {(item.price * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Customer Information Section */}
                        <div className="flex-1 px-4 border-r border-gray-300">
                          <h3 className="text-lg font-semibold mb-2">
                            Customer Information:
                          </h3>
                          <p>Name: {order.customerInfo.name}</p>
                          <p>Email: {order.customerInfo.email}</p>
                          <p>Mobile: {order.customerInfo.mobile}</p>
                        </div>

                        {/* Delivery Information Section */}
                        <div className="flex-1 pl-4">
                          {order.deliveryInfo.address ? (
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Delivery Information:
                              </h3>
                              <p>Address: {order.deliveryInfo.address}</p>
                              <p>City: {order.deliveryInfo.city}</p>
                              <p>
                                Postal Code: {order.deliveryInfo.postalCode}
                              </p>
                              <p>Delivery Method: Delivery</p>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Dine-in Information:
                              </h3>
                              <p>Dine-in Method: Dine-In</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mt-2">
                        Payment Method: {order.paymentMethod}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleUpdateOrder(order)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleDownloadBill(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Download Bill
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleExpand(order._id)}
                    className="absolute top-4 right-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    {expandedOrders[order._id] ? "Show Less" : "Show More"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">No orders found</p>
            )}
          </div>
        )}

        {showEditPopup && (
          <EditOrderPopup
            order={selectedOrder}
            onClose={() => setShowEditPopup(false)}
            onUpdate={(updatedOrder) => {
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order._id === updatedOrder._id ? updatedOrder : order
                )
              );
              setShowEditPopup(false);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
