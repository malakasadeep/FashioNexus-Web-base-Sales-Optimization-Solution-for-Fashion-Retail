import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../layouts/ProductCard"; // Import FashionCard component
import Slider from "react-slick";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";

const FashionItem = () => {
  const { id } = useParams();
  const [fashionItem, setFashionItem] = useState(null); // Initially null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // Initially empty string
  const [selectedColor, setSelectedColor] = useState(""); // Initially empty string
  const { currentUser } = useSelector((state) => state.user);

  // Fetch item data from backend API
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/inventories/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item data.");
        }
        const data = await response.json();
        setFashionItem(data);
        setSelectedSize(data.Sizes[0] || ""); // Check if sizes exist
        setSelectedColor(data.Colors[0] || ""); // Check if colors exist
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    try {
      // Prepare the cart item object
      const cartItem = {
        userId: currentUser._id, // User ID from Redux state
        itemId: id,
        title: fashionItem.ItemName,
        img: fashionItem.imageUrls[0],
        price: fashionItem.UnitPrice,
        quantity,
        size: selectedSize,
        color: selectedColor, // Pass the selected color here
      };

      // Retrieve existing cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(cartItem); // Add the new item to the cart
      localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart back to localStorage

      // Show success alert
      Swal.fire({
        title: "Item added to cart successfully!",
        text: "Would you like to view your cart or add more items?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Add More",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/cart"; // Redirect to cart page
        }
        console.log("Item added to cart:", cartItem);
      });
    } catch (error) {
      // Handle errors (e.g., failed to add to cart)
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the item to the cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSizeChange = (e) => setSelectedSize(e.target.value);
  const handleColorChange = (color) => {
    setSelectedColor(color); // Update the selected color with the clicked color code
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const recommendedItems = fashionItem.recommendedItems || []; // Assuming the API returns recommended items

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
              src={fashionItem.imageUrls[0]}
              alt={fashionItem.ItemName}
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-semibold">{fashionItem.ItemName}</h1>
            <p className="text-lg text-gray-600">{fashionItem.description}</p>
            <h2 className="text-2xl font-semibold">${fashionItem.UnitPrice}</h2>
            <p className="text-md text-gray-500">
              Available Stock: {fashionItem.StockQuantity}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-md font-medium">Select Size:</label>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="border border-gray-300 rounded px-3 py-2"
              >
                {fashionItem.Sizes?.map((size) => (
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
                {fashionItem.Colors?.map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }} // Color code as background
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => handleColorChange(color)} // Set color on click
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
                img={item.imageUrls[0]}
                name={item.ItemName}
                price={item.UnitPrice}
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
