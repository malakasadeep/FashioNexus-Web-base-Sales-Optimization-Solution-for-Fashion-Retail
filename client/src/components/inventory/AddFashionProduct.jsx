import React, { useState } from "react";
import { motion } from "framer-motion";
import { SketchPicker } from "react-color";
import Swal from "sweetalert2"; // Import SweetAlert
import { storage } from "./../../firebase"; // Firebase storage configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage functions
import "tailwindcss/tailwind.css";

export default function AddFashionProduct() {
  const [currentSection, setCurrentSection] = useState(1); // Tracks which form section is displayed
  const [productDetails, setProductDetails] = useState({
    images: [],
    name: "",
    stock: "",
    unitPrice: "",
    addedDate: "",
    category: "",
    availableSizes: [],
    availableColors: [],
    availability: "In Stock",
    description: "",
  });
  const [supplierDetails, setSupplierDetails] = useState({
    supplierName: "",
    contactNo: "",
    email: "",
    address: "",
  });
  const [sizeInput, setSizeInput] = useState(""); // State to manage size input
  const [colorInput, setColorInput] = useState(""); // State to manage color input

  // Function to handle product details change
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  // Function to handle supplier details change
  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails({ ...supplierDetails, [name]: value });
  };

  // Function to handle category selection
  const handleCategoryChange = (e) => {
    setProductDetails({ ...productDetails, category: e.target.value });
  };

  // Function to handle size addition
  const handleAddSize = () => {
    if (sizeInput && !productDetails.availableSizes.includes(sizeInput)) {
      setProductDetails((prevState) => ({
        ...prevState,
        availableSizes: [...prevState.availableSizes, sizeInput],
      }));
      setSizeInput(""); // Reset input field
    }
  };

  // Function to handle size removal
  const handleRemoveSize = (size) => {
    setProductDetails((prevState) => ({
      ...prevState,
      availableSizes: prevState.availableSizes.filter((s) => s !== size),
    }));
  };

  // Function to handle color addition
  const handleAddColor = (color) => {
    if (color && !productDetails.availableColors.includes(color.hex)) {
      setProductDetails((prevState) => ({
        ...prevState,
        availableColors: [...prevState.availableColors, color.hex],
      }));
    }
  };

  // Function to handle color removal
  const handleRemoveColor = (color) => {
    setProductDetails((prevState) => ({
      ...prevState,
      availableColors: prevState.availableColors.filter((c) => c !== color),
    }));
  };

  // Function to handle image addition
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Only allow up to 3 images
    setProductDetails((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  // Function to handle image removal
  const handleRemoveImage = (index) => {
    setProductDetails((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToServer = async () => {
    const formData = new FormData();
    productDetails.images.forEach((image) => {
      formData.append("images", image);
    });
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.filePaths;
  };

  // Validation for form fields
  const validateForm = () => {
    if (!productDetails.name || !productDetails.category) {
      Swal.fire("Error", "Product name and category are required.", "error");
      return false;
    }
    if (productDetails.stock <= 0 || !Number.isInteger(+productDetails.stock)) {
      Swal.fire("Error", "Stock must be a positive integer.", "error");
      return false;
    }
    if (new Date(productDetails.addedDate) > new Date()) {
      Swal.fire("Error", "Added date must be today or in the past.", "error");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierDetails.email)) {
      Swal.fire("Error", "Invalid email format.", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Upload images and get URLs
    const imageUrls = await uploadImagesToServer();

    const dataToSubmit = {
      ...productDetails,
      images: imageUrls,
      supplierDetails,
    };

    // Save data to the backend
    try {
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        // Reset the form
        setProductDetails({
          images: [],
          name: "",
          stock: "",
          unitPrice: "",
          addedDate: "",
          category: "",
          availableSizes: [],
          availableColors: [],
          availability: "In Stock",
          description: "",
        });
        setSupplierDetails({
          supplierName: "",
          contactNo: "",
          email: "",
          address: "",
        });
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleNext = () => setCurrentSection(2);
  const handleBack = () => setCurrentSection(1);

  return (
    <div className="p-8 min-h-screen bg-[#f5ebe0]">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentSection === 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#e3d5ca] p-6 rounded-lg shadow-lg flex relative"
          >
            {/* Left Side: Product Details Form */}
            <div className="w-2/3 pr-4">
              <h2 className="text-2xl font-semibold text-[#775c41] mb-4">
                Product Details
              </h2>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Stock Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={productDetails.stock}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Unit Price Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Unit Price:</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={productDetails.unitPrice}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Added Date Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Added Date:</label>
                <input
                  type="date"
                  name="addedDate"
                  value={productDetails.addedDate}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Category Selection */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Category:</label>
                <select
                  name="category"
                  value={productDetails.category}
                  onChange={handleCategoryChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Category</option>
                  {[
                    "Tops",
                    "Bottoms",
                    "Outerwear",
                    "Dresses and Jumpsuits",
                    "Footwear",
                    "Accessories",
                  ].map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizes and Colors for Specific Categories */}
              {productDetails.category !== "Accessories" &&
                productDetails.category && (
                  <>
                    {/* Available Sizes */}
                    <div className="mb-4">
                      <label className="block mb-1 text-[#775c41]">
                        Available Sizes:
                      </label>
                      <input
                        type="text"
                        placeholder="Add size and press enter"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSize()}
                        className="block w-full p-2 border border-gray-300 rounded"
                      />
                      <div className="mt-2">
                        {productDetails.availableSizes.map((size, index) => (
                          <span
                            key={index}
                            className="inline-block bg-[#a98467] text-white px-2 py-1 rounded-full mr-2 mb-2"
                          >
                            {size}
                            <button
                              className="ml-2 text-xs"
                              onClick={() => handleRemoveSize(size)}
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              {/* Available Colors */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">
                  Available Colors:
                </label>
                <SketchPicker
                  color={colorInput}
                  onChangeComplete={handleAddColor}
                />
                <div className="mt-2">
                  {productDetails.availableColors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-block w-6 h-6 rounded-full mr-2 mb-2"
                      style={{ backgroundColor: color }}
                    >
                      <button
                        className="ml-2 text-xs text-white"
                        onClick={() => handleRemoveColor(color)}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Availability */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">
                  Availability:
                </label>
                <select
                  name="availability"
                  value={productDetails.availability}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={productDetails.description}
                  onChange={handleProductChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
            </div>

            {/* Right Side: Images and Navigation Controls */}
            <div className="w-1/3 pl-4 flex flex-col justify-between">
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Images:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex mt-2">
                  {productDetails.images.map((image, index) => (
                    <div key={index} className="mr-2 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Button */}
              <button
                onClick={handleNext}
                className="bg-[#d4a373] text-white px-6 py-2 rounded hover:bg-[#a98467] transition duration-200 mt-auto"
              >
                Next
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#e3d5ca] p-6 rounded-lg shadow-lg flex"
          >
            {/* Supplier Details Form */}
            <div className="w-2/3 pr-4">
              <h2 className="text-2xl font-semibold text-[#775c41] mb-4">
                Supplier Details
              </h2>

              {/* Supplier Name Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">
                  Supplier Name:
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={supplierDetails.supplierName}
                  onChange={handleSupplierChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Contact Number Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Contact No:</label>
                <input
                  type="text"
                  name="contactNo"
                  value={supplierDetails.contactNo}
                  onChange={handleSupplierChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={supplierDetails.email}
                  onChange={handleSupplierChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Address Input */}
              <div className="mb-4">
                <label className="block mb-1 text-[#775c41]">Address:</label>
                <textarea
                  name="address"
                  value={supplierDetails.address}
                  onChange={handleSupplierChange}
                  className="block w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
            </div>

            {/* Right Side: Navigation Controls */}
            <div className="w-1/3 pl-4 flex flex-col justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-400 transition duration-200 mb-4"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#d4a373] text-white px-6 py-2 rounded hover:bg-[#a98467] transition duration-200"
              >
                Submit
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
