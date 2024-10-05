import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Clock } from "lucide-react";

export default function DiscountCard({
  id,
  img,
  name = "No name available",
  price = 0,
  description = "No description available",
  stockCount = 0,
  sizes = [],
  colors = [],
  offers = [],
}) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const offer = offers.length > 0 ? offers[0] : null;

  useEffect(() => {
    if (!offer || !offer.endDate) {
      setTimeLeft("No offer available");
      return; // Exit early if offer or endDate is missing
    }

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(offer.endDate);
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  const handleCardClick = () => {
    navigate(`/item/${id}`);
  };

  return (
    <motion.div
      className="w-11/12 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={img || "/placeholder-image.jpg"}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {offer && offer.discountPercentage ? (
          <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-br-lg">
            {offer.discountPercentage}% OFF
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{name}</h2>
        <p className="text-sm text-gray-600 mb-2">
          {offer?.promotionName || "No promotion available"}
        </p>

        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${offer?.finalPrice || price}
            </span>
            {offer && offer.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${offer.price}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Clock className="w-4 h-4 mr-1" />
          <span>{timeLeft}</span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Stock: {stockCount} left
          </span>
          <span className="text-sm font-medium text-blue-600">
            Code: {offer?.promotionCode || "N/A"}
          </span>
        </div>

        <motion.button
          className="w-full bg-DarkColor text-white py-2 rounded-lg font-medium transition duration-300 hover:bg-ExtraDarkColor flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>

      {timeLeft !== "Offer expired" && offer && (
        <motion.div
          className="absolute top-2 right-2 bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs font-bold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Limited Offer!
        </motion.div>
      )}
    </motion.div>
  );
}
