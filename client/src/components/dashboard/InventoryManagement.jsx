
import { motion } from "framer-motion";
import { MdInfo } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InventoryReport from "../inventory/InventoryReport";

export default function InventoryManagement() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    category: "all",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false); // Tracks the loading state while fetching inventory data.
  const [inventories, setInventories] = useState([]); // Holds the array of inventories fetched from the server.

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
        const res = await fetch(
          `http://localhost:3000/api/inventories/search/get?${searchQuery}`
        );
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
    if (e.target.type === "select-one") {
      setSearchData({ ...searchData, category: e.target.value });
    }
    if (e.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }
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

  return (
    <motion.div
      className=" bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "#a98467" }} // ExtraDarkColor for the main heading
      >
        Inventory Management
      </h1>
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold text-DarkColor mb-4">
          Inventory Warehouse
        </h2>
        <div className="search--line flex items-center gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            id="searchTerm"
            className="border p-3 rounded-lg bg-slate-200 flex-1"
          />
          <select
            className="border p-3 rounded-lg bg-slate-200 flex-1"
            name="category"
            id="category"
            required
            onChange={handleChange}
          >
            <option className="text-slate-400" hidden>
              Category
            </option>
            <option value="all">All</option>
            <option value="Men's Clothing">Men's Clothing</option>
            <option value="Women's Clothing">Women's Clothing</option>
            <option value="Kids' Clothing">Kids' Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>
          <button
            className="bg-DarkColor text-white p-3 rounded hover:bg-ExtraDarkColor transition"
            onClick={handleSubmit}
          >
            Search
          </button>
          <div className="user--btn">
            <InventoryReport inventory={inventories} />
          </div>
          <button
            className="bg-DarkColor text-white p-3 rounded hover:bg-ExtraDarkColor transition"
            onClick={() => navigate("create")}
          >
            Add Item
          </button>
        </div>
        <table className="min-w-full bg-PrimaryColor shadow-md rounded">
          <thead>
            <tr>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Images
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Item Name
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Category
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Price
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Sizes
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Colors
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Quantity
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Reorder Level
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Stock Status
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Supplier Name
              </td>
              <td className="text-left px-2 py-2 font-semibold text-DarkColor">
                Supplier Contact
              </td>
              <td className="text-left px-6 py-2 font-semibold text-DarkColor">
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inventory) => (
              <tr key={inventory._id} className="hover:bg-PrimaryColor">
                <td className="text-left px-6 py-4 font-normal text-black">
                  {/* Display the image here */}
                  {inventory.imageUrls ? (
                    <img
                      // src={inventory.imageUrls[0]} // palaweni image eka
                      src={inventory.imageUrls[inventory.imageUrls?.length - 1]} // anthima image eka
                      alt={inventory.ItemName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.ItemName}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.Category}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  ${inventory.UnitPrice}.00
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.Sizes}
                </td>
                {/* <td className="text-left px-6 py-4 font-normal text-black">{inventory.Colors}</td> */}

                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.Colors &&
                    inventory.Colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></span>
                    ))}
                </td>

                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.StockQuantity}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.ReorderLevel}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.StockStatus}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.SupplierName}
                </td>
                <td className="text-left px-6 py-4 font-normal text-black">
                  {inventory.SupplierContact}
                </td>

                <td className="">
                  <div className="flex">
                    <Link
                      to={`/admin/inventories/get/${inventory._id}`}
                      className="btn1"
                    >
                      <MdInfo className="text-2xl" />
                    </Link>
                    <Link to={`/update/${inventory._id}`} className="btnU">
                      <FaEdit className="text-2xl" />
                    </Link>
                    <button
                      className="btnD"
                      onClick={(e) => handleDelete(inventory._id)}
                    >
                      <MdDeleteForever className="text-2xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
}
