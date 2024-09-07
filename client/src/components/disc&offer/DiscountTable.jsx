import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import UpdateDiscountPopup from "./UpdateDiscountPopup";

const DiscountTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewMoreDiscount, setViewMoreDiscount] = useState(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Fetch all discounts from the backend
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get("/api/discount/get");
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  // Delete a discount
  const deleteDiscount = async (id) => {
    // Display confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    // If the user confirms, proceed with deletion
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/discount/delete/${id}`);
        Swal.fire("Deleted!", "The discount has been deleted.", "success");
        fetchDiscounts(); // Refresh the discount list
      } catch (error) {
        console.error("Error deleting discount:", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the discount.",
          "error"
        );
      }
    }
  };

  // Download report as CSV
  const downloadReport = () => {
    const csvContent = [
      [
        "Discount Title",
        "Discount Rate",
        "Start Date",
        "End Date",
        "Conditions",
        "Description",
        "Final Price",
        "Actual Price",
      ],
      ...discounts.map((discount) => [
        discount.title,
        discount.rate,
        new Date(discount.period.start).toLocaleDateString(),
        new Date(discount.period.end).toLocaleDateString(),
        discount.conditions,
        discount.description,
        discount.finalPrice.toFixed(2),
        discount.actualprice.toFixed(2),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "discounts_report.csv");
  };

  // Filter discounts based on search query
  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.conditions.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the update popup
  const handleUpdateClick = (discount) => {
    setSelectedDiscount(discount);
    setIsPopupOpen(true);
  };

  // Handle closing the update popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedDiscount(null);
  };

  // Handle update success
  const handleUpdateSuccess = (updatedDiscount) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount._id === updatedDiscount._id ? updatedDiscount : discount
      )
    );
    handleClosePopup();
  };

  // Handle view more details
  const handleViewMoreClick = (discount) => {
    setViewMoreDiscount(discount);
  };

  return (
    <div className="p-6 bg-[#f5ebe0] text-[#775c41]">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search discounts..."
          className="p-2 border border-SecondaryColor rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={downloadReport}
          className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467]"
        >
          Download Report
        </button>
      </div>

      <table className="w-full bg-[#e3d5ca] rounded-md">
        <thead>
          <tr className="text-left border-b-2 border-[#d4a373]">
            <th className="p-2">Discount Title</th>
            <th className="p-2">Rate (%)</th>
            <th className="p-2">Period</th>
            <th className="p-2">Final Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDiscounts.map((discount) => (
            <tr key={discount._id} className="border-b hover:bg-[#f5ebe0]">
              <td className="p-2">{discount.title}</td>
              <td className="p-2">{discount.rate}%</td>
              <td className="p-2">
                {new Date(discount.period.start).toLocaleDateString()} -{" "}
                {new Date(discount.period.end).toLocaleDateString()}
              </td>
              <td className="p-2">${discount.finalPrice.toFixed(2)}</td>
              <td className="p-2">
                <button
                  onClick={() => handleUpdateClick(discount)}
                  className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleViewMoreClick(discount)}
                  className="bg-[#d4a373] text-white px-2 py-1 rounded hover:bg-[#a98467] mr-2"
                >
                  View More
                </button>
                <button
                  onClick={() => deleteDiscount(discount._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
        <UpdateDiscountPopup
          discount={selectedDiscount}
          onClose={handleClosePopup}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {viewMoreDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#f5ebe0] p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-[#d4a373]">
              Discount Details
            </h2>
            <p>
              <strong>Item Id:</strong> {viewMoreDiscount.itemId}
            </p>
            <p>
              <strong>Discount Id:</strong> {viewMoreDiscount.id}
            </p>
            <p>
              <strong>Actual Price:</strong> $
              {viewMoreDiscount.actualprice.toFixed(2)}
            </p>
            <p>
              <strong>Conditions:</strong> {viewMoreDiscount.conditions}
            </p>
            <p>
              <strong>Description:</strong> {viewMoreDiscount.description}
            </p>
            <button
              onClick={() => setViewMoreDiscount(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountTable;
