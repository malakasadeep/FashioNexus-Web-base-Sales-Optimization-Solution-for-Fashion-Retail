// src/pages/FashionItem.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import items from "../../components/disc&offer/items"; // Import fashion item data file
import ProductCard from "../../layouts/ProductCard"; // Import FashionCard component
import Slider from "react-slick";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../../components/dashboard/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const FashionItem = () => {
  const { id } = useParams();
  const fashionItem = items.find((item) => item.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(fashionItem.sizes[0]); // Default to first size
  const [selectedColor, setSelectedColor] = useState(fashionItem.colors[0]); // Default to first color

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    try {
      const cartItem = {
        userId: "user001", // Static user ID for demonstration
        itemId: fashionItem.id,
        title: fashionItem.name,
        img: fashionItem.img,
        price: fashionItem.price,
        quantity,
        size: selectedSize,
        color: selectedColor.name,
      };

      // Save to local storage or send to the backend API
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Show success alert box with options using SweetAlert2
      Swal.fire({
        title: "Item added to cart successfully!",
        text: "Would you like to view your cart or add more items?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Add More",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/cart";
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the item to the cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSizeChange = (e) => setSelectedSize(e.target.value);
  const handleColorChange = (color) => setSelectedColor(color);

  const recommendedItems = items.filter((item) => item.id !== fashionItem.id);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen p-8 flex flex-col items-center"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="w-3/4 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-10 mt-16">
          <div className="w-full lg:w-1/2">
            <img
              className="rounded-xl w-full transition-transform duration-300 transform hover:scale-105"
              src={fashionItem.img}
              alt={fashionItem.name}
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-semibold">{fashionItem.name}</h1>
            <p className="text-lg text-gray-600">{fashionItem.description}</p>
            <h2 className="text-2xl font-semibold">${fashionItem.price}</h2>
            <p className="text-md text-gray-500">
              Available Stock: {fashionItem.stockCount}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-md font-medium">Select Size:</label>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="border border-gray-300 rounded px-3 py-2"
              >
                {fashionItem.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="block text-md font-medium">Select Color:</label>
              <div className="flex space-x-3">
                {fashionItem.colors.map((color) => (
                  <button
                    key={color.name}
                    style={{ backgroundColor: color.code }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor.name === color.name
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDecrease}
                className="px-4 py-2 bg-gray-200 rounded-full"
              >
                -
              </button>
              <span className="text-xl">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-4 py-2 bg-gray-200 rounded-full"
              >
                +
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
              >
                Add to Cart
              </button>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Items Section */}
        <div className="w-full lg:w-5/6 mt-16 mb-14">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "#a98467" }}
          >
            Recommended for You
          </h2>
          <Slider {...settings}>
            {recommendedItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                img={item.img}
                name={item.name}
                price={item.price}
              />
            ))}
          </Slider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FashionItem;
