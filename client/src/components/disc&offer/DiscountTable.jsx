import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import UpdateDiscountPopup from "./UpdateDiscountPopup"; // Import the UpdateDiscountPopup component

export default function DiscountTable({ onAddDiscount, onGenerateReport }) {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    // Fetch initial discount data
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("/api/discount/get");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch discounts.", "error");
      }
    };

    fetchDiscounts();
  }, []);

  const handleToggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenUpdatePopup = (discount) => {
    setSelectedDiscount(discount);
    setIsUpdatePopupOpen(true);
  };

  const handleCloseUpdatePopup = () => {
    setIsUpdatePopupOpen(false);
    setSelectedDiscount(null);
  };

  const handleUpdateDiscount = async (updatedDiscount) => {
    try {
      const response = await fetch(
        `/api/discount/update/${updatedDiscount._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDiscount),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setDiscounts((prev) =>
        prev.map((discount) => (discount._id === data._id ? data : discount))
      );
      Swal.fire("Updated", "Discount has been updated successfully", "success");
      handleCloseUpdatePopup();
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to update discount. Please try again.",
        "error"
      );
    }
  };

  // Implementing Delete Discount Functionality
  const handleDeleteDiscount = async (discountId) => {
    // Show confirmation alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // If the user confirms, proceed with the deletion
      try {
        const response = await fetch(`/api/discount/delete/${discountId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete discount.");
        }

        // Remove the deleted discount from the state
        setDiscounts((prev) =>
          prev.filter((discount) => discount._id !== discountId)
        );
        Swal.fire(
          "Deleted!",
          "Discount has been deleted successfully.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to delete discount. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-SecondaryColor p-8 rounded-lg shadow-lg mb-10">
      <h2 className="text-2xl font-semibold text-DarkColor mb-4">
        Discount Table
      </h2>
      <input
        type="text"
        placeholder="Search Discounts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-DarkColor rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-ExtraDarkColor transition duration-300"
      />
      <motion.button
        className="bg-DarkColor text-white px-4 py-2 rounded-lg shadow-md mb-4 hover:bg-ExtraDarkColor hover:shadow-lg transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGenerateReport}
      >
        Generate Report
      </motion.button>
      <table className="min-w-full bg-PrimaryColor shadow-md rounded overflow-hidden">
        <thead>
          <tr className="bg-ExtraDarkColor text-white">
            <th className="p-4 text-left text-PrimaryColor">Name</th>
            <th className="p-4 text-left text-PrimaryColor">Discount</th>
            <th className="p-4 text-left text-PrimaryColor">Final Price</th>
            <th className="p-4 text-left text-PrimaryColor">Start Date</th>
            <th className="p-4 text-left text-PrimaryColor">End Date</th>
            <th className="p-4 text-left text-PrimaryColor">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts
            .filter((offer) =>
              offer.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((offer) => (
              <React.Fragment key={offer._id}>
                <motion.tr
                  className="hover:bg-SecondaryColor transition duration-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <td className="p-4 border-b border-DarkColor">
                    {offer.title}
                  </td>
                  <td className="p-4 border-b border-DarkColor">
                    {offer.rate}%
                  </td>
                  <td className="p-4 border-b border-DarkColor">
                    $ {offer.finalPrice}
                  </td>
                  <td className="p-4 border-b border-DarkColor">
                    {new Date(offer.period.start).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b border-DarkColor">
                    {new Date(offer.period.end).toLocaleDateString()}
                  </td>

                  <td className="p-4 border-b border-DarkColor">
                    <button
                      className="text-blue-500 underline hover:text-blue-700"
                      onClick={() => handleToggleRow(offer._id)}
                    >
                      {expandedRows[offer._id] ? "Hide" : "Show More"}
                    </button>
                  </td>
                </motion.tr>
                {expandedRows[offer._id] && (
                  <motion.tr
                    className="bg-PrimaryColor text-DarkColor"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan="6" className="p-4 border-b border-DarkColor">
                      <p>
                        <strong>Item Id:</strong> {offer.itemId}
                      </p>
                      <p>
                        <strong>Discount Id:</strong> {offer._id}
                      </p>
                      <p>
                        <strong>Actual Price:</strong>$ {offer.actualprice}
                      </p>
                      <p>
                        <strong>Conditions:</strong>{" "}
                        {offer.conditions || "No conditions available."}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {offer.description || "No description available."}
                      </p>
                      <div className="flex space-x-3 mt-4">
                        <motion.button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 hover:shadow-lg transition duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenUpdatePopup(offer)}
                        >
                          Update
                        </motion.button>
                        <motion.button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 hover:shadow-lg transition duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteDiscount(offer._id)}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      {isUpdatePopupOpen && (
        <UpdateDiscountPopup
          discount={selectedDiscount}
          onClose={handleCloseUpdatePopup}
          onUpdate={handleUpdateDiscount}
        />
      )}
    </div>
  );
}
