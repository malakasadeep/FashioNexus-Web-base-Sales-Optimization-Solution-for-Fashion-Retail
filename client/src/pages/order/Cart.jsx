import React, { useState, useEffect } from "react";
import ProductCard from "../../layouts/ProductCard";
import items from "../../components/disc&offer/items"; // Data for fashion items
import LoadingSpinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Load cart items from local storage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cartData);
    calculateSubtotal(cartData);
    setIsLoading(false); // Set loading to false after loading data
  }, []);

  // Function to calculate subtotal
  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  };

  // Handle remove item
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.itemId !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  // Handle increase quantity
  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  // Handle decrease quantity
  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.itemId === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  // Handle apply promo code
  const handleApplyPromo = () => {
    // Example: Apply a 10% discount if the promo code is "SAVE10"
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("Invalid promo code!");
    }
  };

  // Show loading spinner if loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCheckout = () => {
    const checkoutData = {
      userId: currentUser._id, // Static user ID for demonstration
      items: cartItems,
      total: subtotal - discount,
    };

    // Pass data to the checkout page using navigate
    navigate("/checkout", { state: checkoutData });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-8 flex flex-col items-center">
        <div className="w-full lg:w-3/4 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10 mt-20">
          {/* Left Side: Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            <h1 className="text-3xl font-semibold mb-4">Your Fashion Cart</h1>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-16 rounded"
                  />
                  <div className="flex-1 px-4">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-600">Price: ${item.price}</p>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">
                      Color:{" "}
                      <span
                        style={{
                          backgroundColor: item.color,
                          color: item.color,
                        }}
                        className="w-8 h-8 rounded-full text-xs"
                      >
                        ws
                      </span>
                    </p>{" "}
                    {/* Display color */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDecreaseQuantity(item.itemId)}
                        className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span>Quantity: {item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.itemId)}
                        className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-800 font-semibold">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.itemId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-1/3 p-6 bg-gray-100 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={item.itemId}
                className="flex justify-between items-center"
              >
                <span className="font-semibold">{item.title}</span>
                <span> {item.quantity}</span>
                <span> ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Total:</span>
              <span>${(subtotal - discount).toFixed(2)}</span>
            </div>
            <input
              type="text"
              placeholder="Promo Code"
              className="w-full p-2 border rounded"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              onClick={handleApplyPromo}
              className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300"
            >
              Apply Promo Code
            </button>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
