import { motion, AnimatePresence } from "framer-motion";
import { MdInfo } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InventoryReport from "./InventoryReport";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { Scrollbars } from "react-custom-scrollbars-2";

export default function InventoryManagementAll() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    category: "all",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    itemInfo: true,
    supplierInfo: false,
    stockInfo: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const category = urlParams.get("category") || "all";
    const sort = urlParams.get("sort") || "created_at";
    const order = urlParams.get("order") || "desc";
    setSearchData({ searchTerm, category, sort, order });

    const fetchInventories = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/inventories/search/get?${searchQuery}`);
        const data = await res.json();
        setInventories(data);
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
      setLoading(false);
    };

    fetchInventories();
  }, [location.search]);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("category", searchData.category);
    const searchQuery = urlParams.toString();
    navigate(`/manager/inventory-management?${searchQuery}`);
  };

  const handleEdit = (inventoryId) => {
    navigate(`/update/${inventoryId}`);
  };

  const handleDelete = async (inventoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/inventories/${inventoryId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          Swal.fire({
            title: "Deleted!",
            text: "The inventory item has been deleted.",
            icon: "success",
          });
          setInventories((prev) =>
            prev.filter((inventory) => inventory._id !== inventoryId)
          );
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };

  const handleOverview = (inventory) => {
    setSelectedPart(inventory);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] px-6 py-8 rounded-lg "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="">
        <motion.h2
          className="text-3xl font-semibold text-DarkColor mb-6"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Inventory Warehouse
        </motion.h2>

        {/* Search Bar */}
        <motion.div
          className="search--line flex items-center gap-4 mb-6 flex-wrap"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex-1">
            <AiOutlineSearch className="absolute left-3 top-3 text-xl text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              onChange={handleChange}
              name="searchTerm"
              className="border p-3 pl-10 rounded-lg bg-slate-200 w-full"
            />
          </div>
          <select
            className="border p-3 rounded-lg bg-slate-200 flex-1"
            name="category"
            required
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="Men's Clothing">Men's Clothing</option>
            <option value="Women's Clothing">Women's Clothing</option>
            <option value="Kids' Clothing">Kids' Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>
          <motion.button
            className="bg-DarkColor text-white p-3 rounded-lg hover:bg-ExtraDarkColor transition"
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
          >
            Search
          </motion.button>
          <motion.div whileHover={{ scale: 1.1 }}>
            <InventoryReport inventory={inventories} />
          </motion.div>
        </motion.div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
        )}

        {/* Inventory Table */}
        <motion.table
          className="min-w-full bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Image
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Item Name
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Category
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Price
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Sizes
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Colors
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Stock Quantity
              </th>
              <th className="text-left px-6 py-4 font-semibold text-DarkColor">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inventory) => (
              <motion.tr
                key={inventory._id}
                whileHover={{ scale: 1.02 }}
                className="hover:bg-PrimaryColor transition-all duration-200"
              >
                <td className="text-left px-6 py-4">
                  {inventory.imageUrls ? (
                    <img
                      src={inventory.imageUrls[0]}
                      alt={inventory.ItemName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="text-left px-6 py-4">{inventory.ItemName}</td>
                <td className="text-left px-6 py-4">{inventory.Category}</td>
                <td className="text-left px-6 py-4">
                  ${inventory.UnitPrice}.00
                </td>
                <td className="text-left px-6 py-4">{inventory.Sizes}</td>
                <td className="text-left px-6 py-4">
                  {inventory.Colors &&
                    inventory.Colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-500"
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                </td>
                <td className="text-left px-6 py-4">
                  {inventory.StockQuantity}
                </td>
                <td className="text-left px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/update/${inventory._id}`}>
                      <FaEdit className="text-xl text-DarkColor" />
                    </Link>
                    <button
                      onClick={() => handleDelete(inventory._id)}
                      className="text-red-600"
                    >
                      <MdDeleteForever className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOverview(inventory)}
                      className="text-blue-500"
                    >
                      <MdInfo className="text-xl" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
      {/* Item Overview Popup */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Title */}
              <h2 className="text-2xl text-gray-800 mb-6 font-bold border-b border-gray-300 pb-2">
                {selectedPart.ItemName}
              </h2>

              {/* Scrollable Content Area with Custom Scrollbars */}
              <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                style={{ height: "400px" }}
                renderThumbVertical={({ style, ...props }) => (
                  <div
                    {...props}
                    style={{
                      ...style,
                      backgroundColor: "#888",
                      borderRadius: "4px",
                    }}
                  />
                )}
              >
                {/* Item Information Section */}
                <div className="mb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("itemInfo")}
                  >
                    <h3 className="text-xl font-semibold text-gray-700">
                      Item Information
                    </h3>
                    {expandedSections.itemInfo ? (
                      <MdExpandLess className="text-xl text-gray-500" />
                    ) : (
                      <MdExpandMore className="text-xl text-gray-500" />
                    )}
                  </div>
                  {expandedSections.itemInfo && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="flex space-x-6">
                        <div className="w-1/3">
                          <img
                            src={selectedPart.imageUrls[0]}
                            alt={selectedPart.ItemName}
                            className="w-full h-auto object-cover rounded shadow-lg"
                          />
                        </div>
                        <div className="w-2/3 space-y-2">
                          <p>
                            <strong>Description:</strong>{" "}
                            {selectedPart.description}
                          </p>
                          <p>
                            <strong>Category:</strong> {selectedPart.Category}
                          </p>
                          <p>
                            <strong>Sizes:</strong> {selectedPart.Sizes}
                          </p>
                          <p>
                            <strong>Colors:</strong>{" "}
                            {selectedPart.Colors.map((color, index) => (
                              <span
                                key={index}
                                className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-500"
                                style={{ backgroundColor: color }}
                              ></span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Supplier Information Section */}
                <div className="mb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("supplierInfo")}
                  >
                    <h3 className="text-xl font-semibold text-gray-700">
                      Supplier Information
                    </h3>
                    {expandedSections.supplierInfo ? (
                      <MdExpandLess className="text-xl text-gray-500" />
                    ) : (
                      <MdExpandMore className="text-xl text-gray-500" />
                    )}
                  </div>
                  {expandedSections.supplierInfo && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p>
                        <strong>Supplier:</strong> {selectedPart.SupplierName}
                      </p>
                      <p>
                        <strong>Supplier Contact:</strong>{" "}
                        {selectedPart.SupplierContact}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Stock Information Section */}
                <div className="mb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("stockInfo")}
                  >
                    <h3 className="text-xl font-semibold text-gray-700">
                      Stock Information
                    </h3>
                    {expandedSections.stockInfo ? (
                      <MdExpandLess className="text-xl text-gray-500" />
                    ) : (
                      <MdExpandMore className="text-xl text-gray-500" />
                    )}
                  </div>
                  {expandedSections.stockInfo && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p>
                        <strong>Price:</strong> Rs {selectedPart.UnitPrice}
                      </p>
                      <p>
                        <strong>SKU:</strong> {selectedPart.SKU}
                      </p>
                      <p>
                        <strong>Stock Quantity:</strong>{" "}
                        {selectedPart.StockQuantity}
                      </p>
                      <p>
                        <strong>Stock Status:</strong>{" "}
                        {selectedPart.StockStatus}
                      </p>
                    </motion.div>
                  )}
                </div>
              </Scrollbars>

              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedPart(null)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
