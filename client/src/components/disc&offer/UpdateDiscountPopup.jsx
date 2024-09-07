import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function UpdateDiscountPopup({ discount, onClose, onUpdate }) {
  const [discountTitle, setDiscountTitle] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [description, setDescription] = useState("");
  const [actualPrice, setActualPrice] = useState(0);

  useEffect(() => {
    if (discount) {
      setDiscountTitle(discount.title);
      setDiscountRate(discount.rate);
      setStartDate(formatDate(discount.period.start));
      setEndDate(formatDate(discount.period.end));
      setConditions(discount.conditions);
      setDescription(discount.description);
      setActualPrice(discount.actualprice);
    }
  }, [discount]);

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toISOString().split("T")[0];
  };

  const calculateDiscountedPrice = () => {
    const actualPriceFloat = parseFloat(actualPrice);
    const discountRateFloat = parseFloat(discountRate);
    if (isNaN(actualPriceFloat) || isNaN(discountRateFloat)) return 0;
    return (
      actualPriceFloat -
      (actualPriceFloat * discountRateFloat) / 100
    ).toFixed(2);
  };

  const validateForm = () => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (discountRate >= 100) {
      Swal.fire(
        "Invalid Discount Rate",
        "Discount rate must be less than 100%.",
        "error"
      );
      return false;
    }

    if (start < currentDate) {
      Swal.fire(
        "Invalid Start Date",
        "Start date must be today or in the future.",
        "error"
      );
      return false;
    }

    if (end <= start) {
      Swal.fire(
        "Invalid End Date",
        "End date must be after the start date.",
        "error"
      );
      return false;
    }

    if (
      !discountTitle ||
      !startDate ||
      !endDate ||
      !conditions ||
      !description
    ) {
      Swal.fire("Missing Fields", "Please fill out all fields.", "error");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      const updatedOffer = {
        title: discountTitle,
        rate: parseFloat(discountRate),
        period: { start: startDate, end: endDate },
        conditions,
        description,
        finalPrice: calculateDiscountedPrice(),
        actualprice: parseFloat(actualPrice),
      };

      try {
        const response = await fetch(`/api/discount/update/${discount._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOffer),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Log backend error details
          console.error("Error updating discount:", errorData);
          throw new Error("Failed to update discount.");
        }

        const data = await response.json();
        Swal.fire("Success", "Discount updated successfully!", "success");
        onUpdate(data); // Update with the response data
        onClose();
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to update discount. Please try again.",
          "error"
        );
        console.error("Update Error:", error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-PrimaryColor p-6 rounded-lg shadow-xl w-full max-w-lg"
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h2 className="text-xl font-bold mb-4 text-ExtraDarkColor">
          Update Discount for {discount.itemId}
        </h2>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            Discount Title
          </label>
          <input
            type="text"
            value={discountTitle}
            onChange={(e) => setDiscountTitle(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            Discount Rate (%)
          </label>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            Conditions
          </label>
          <input
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-DarkColor mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border border-SecondaryColor rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
          />
        </div>
        <div className="mb-4">
          <p className="text-lg font-bold text-ExtraDarkColor">
            Final Price: ${calculateDiscountedPrice()}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={handleUpdate}
            className="bg-DarkColor text-white px-4 py-2 rounded-lg shadow hover:bg-ExtraDarkColor transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update Offer
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
