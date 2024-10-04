import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// import generateBill from "../components/GenarateBill";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, userId, total } = location.state || {};

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);

  // Helper function to handle input changes for customer info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // Helper function to handle input changes for delivery info
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // Helper function to handle input changes for card info
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // Function to validate form inputs
  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.mobile) {
      Swal.fire(
        "Validation Error",
        "Please fill in all customer details.",
        "error"
      );
      return false;
    }
    if (
      !deliveryInfo.address ||
      !deliveryInfo.city ||
      !deliveryInfo.postalCode
    ) {
      Swal.fire(
        "Validation Error",
        "Please fill in all delivery details.",
        "error"
      );
      return false;
    }
    if (
      paymentMethod === "Card" &&
      (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv)
    ) {
      Swal.fire(
        "Validation Error",
        "Please fill in all card details.",
        "error"
      );
      return false;
    }
    return true;
  };

  // Function to handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const orderData = {
      userId,
      items,
      total,
      customerInfo,
      deliveryInfo,
      paymentMethod,
      cardInfo: paymentMethod === "Card" ? cardInfo : undefined, // Only send cardInfo if payment is by Card
    };

    try {
      console.log(orderData.items);

      const response = await axios.post(
        "http://localhost:3000/api/order/add",
        orderData
      ); // Ensure the URL is correct
      localStorage.removeItem("cart");
      //   generateBill({
      //     ...orderData,
      //     orderId: response.data.orderId,
      //   });
      setLoading(false);
      Swal.fire(
        "Success",
        `Order placed successfully! Order ID: ${response.data.orderId}`,
        "success"
      ).then(() => {
        navigate("/my-orders");
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", "Failed to place order. Please try again.", "error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-8 flex flex-col items-center">
        <div className="w-full lg:w-3/4 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10 mt-20">
          {/* Left Side: Order Summary */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-3xl font-semibold mb-4">Order Summary</h1>
            {items && items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center p-4 border-b"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-gray-500">
                        Color:{" "}
                        <button
                          style={{ backgroundColor: item.color }}
                          className="w-5 h-5 rounded-full border-2 "
                        />{" "}
                        Size: {item.size}
                      </span>
                    </div>
                  </div>

                  <span> Qty: {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No items to display</p>
            )}
            <div className="flex justify-between mt-4 font-semibold">
              <span>Subtotal:</span>
              <span>${total?.toFixed(2) || 0}</span>
            </div>
            {/* Back to Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="mt-4 w-full bg-gray-300 text-black py-2 rounded-full hover:bg-gray-400 transition duration-300"
            >
              Back to Cart
            </button>
          </div>

          {/* Right Side: Customer Information Form */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-100 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              Customer Information
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile No."
              value={customerInfo.mobile}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            {/* Delivery Info Section (Only if Deliver is selected) */}

            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Delivery Information
              </h2>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={deliveryInfo.address}
                onChange={handleDeliveryChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={deliveryInfo.city}
                onChange={handleDeliveryChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={deliveryInfo.postalCode}
                onChange={handleDeliveryChange}
                className="w-full p-2 border rounded"
              />
            </>

            {/* Payment Info Section */}
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Payment Information
            </h2>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>

            {/* Card Info Section (Only if Card is selected) */}
            {paymentMethod === "Card" && (
              <>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardInfo.cardNumber}
                  onChange={handleCardChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardInfo.expiryDate}
                  onChange={handleCardChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardInfo.cvv}
                  onChange={handleCardChange}
                  className="w-full p-2 border rounded"
                />
              </>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
