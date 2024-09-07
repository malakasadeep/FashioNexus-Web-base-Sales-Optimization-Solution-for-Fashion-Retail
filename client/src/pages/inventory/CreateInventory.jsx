import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Make sure to use this hook for navigation

function CreateInventory({ currentUser }) {
  const [formData, setFormData] = useState({
    ItemName: "",
    Category: "Men's Clothing",
    SKU: "",
    description: "",
    StockQuantity: "",
    ReorderLevel: "",
    StockStatus: "",
    SupplierName: "",
    SupplierContact: "",
    imageUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });

    const { name, value } = e.target;

    if (name === "SupplierContact") {
      // Validate that SupplierContact contains only digits and has a maximum of 10 digits
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Supplier Contact must be a number and contain up to 10 digits.",
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ...urls] });
    localStorage.setItem(
      "uploadedImages",
      JSON.stringify([...formData.imageUrls, ...urls])
    ); // Save to local storage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.ReorderLevel <= 0) {
        // Reorder Level must be greater than zero
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Reorder Level must be greater than zero.",
        });
        setLoading(false);
        return;
      }

      if (formData.StockQuantity < 0) {
        // Stock Quantity must be greater than or equal to zero
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Stock Quantity must be greater than zero.",
        });
        setLoading(false);
        return;
      }

      const res = await fetch("/api/inventories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${data.message}`,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Inventory added successfully",
        });
        navigate(`/manager/inventory-management`); // Navigate to the newly created inventory item
      }
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${error.message}`,
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-PrimaryColor rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-ExtraDarkColor mb-6">
        Add Inventory
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="ItemName"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.ItemName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Category
          </label>
          <select
            name="Category"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.Category}
            onChange={handleInputChange}
            required
          >
            <option value="Men's Clothing">Men's Clothing</option>
            <option value="Women's Clothing">Women's Clothing</option>
            <option value="Kids' Clothing">Kids' Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>

        {/* SKU */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">SKU</label>
          <input
            type="number"
            name="SKU"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.SKU}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* Stock Quantity */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Stock Quantity
          </label>
          <input
            type="number"
            name="StockQuantity"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.StockQuantity}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Reorder Level */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Reorder Level
          </label>
          <input
            type="number"
            name="ReorderLevel"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.ReorderLevel}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Stock Status
          </label>
          <input
            type="text"
            name="StockStatus"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.StockStatus}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Supplier Name */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Supplier Name
          </label>
          <input
            type="text"
            name="SupplierName"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.SupplierName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Supplier Contact */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Supplier Contact
          </label>
          <input
            type="text"
            name="SupplierContact"
            className="w-full p-2 border border-SecondaryColor rounded"
            value={formData.SupplierContact}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-DarkColor font-medium mb-2">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            className="w-full p-2 border border-SecondaryColor rounded"
            onChange={handleImageUpload}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 mt-4 bg-DarkColor text-white rounded hover:bg-ExtraDarkColor transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default CreateInventory;
