// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import { Sidebar } from "../Sidebar";
import { MdInfo } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
// import loadingimg from "../../assets/img/loading.gif";
import Swal from "sweetalert2"; //for displaying alerts

function InventoryTable() {
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
    navigate(`/admin/inventories?${searchQuery}`);
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
    <div
      className="dashboard"
      style={{ background: "#dde6ed", padding: "20px" }}
    >
      {/* <Sidebar /> */}
      <div className="dashboard--content">
        <div>
          <div className="list--header">
            <div className="user--title">
              <h1>Inventory Management</h1>
            </div>
            <br />
            <div className="search--line">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                id="searchTerm"
              />
              <select
                className="border p-3 rounded-lg ml-5 bg-slate-200"
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
                onClick={handleSubmit}
                className="bg-transparent hover:bg-blue-500 text-blue-900 font-semibold text-2xl hover:text-white border border-blue-900 hover:border-transparent rounded ml-10 px-16"
              >
                Search
              </button>
            </div>

            <div className="list--container">
              {!loading && inventories.length === 0 && (
                <p className="text-2xl text-center p-5 text-blue-950">
                  No Inventories found
                </p>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center">
                  {/* <img src={loadingimg} alt="loading" className="w-28" /> */}
                  <p className="text-lg w-full text-center">Loading....</p>
                </div>
              )}
              {!loading && inventories.length > 0 && (
                <table className="list">
                  <tbody>
                    <tr className="font-semibold text-blue-900 text-lg text-center">
                      <td>Item Name</td>
                      <td>Category</td>
                      <td>Quantity</td>
                      <td>Reorder Level</td>
                      <td>Stock Status</td>
                      <td>Supplier Name</td>
                      <td>Supplier Contact</td>
                      <td>Action</td>
                    </tr>
                    {inventories.map((inventory) => (
                      <tr className="text-center" key={inventory._id}>
                        <td>{inventory.ItemName}</td>
                        <td>{inventory.Category}</td>
                        <td>{inventory.StockQuantity}</td>
                        <td>{inventory.ReorderLevel}</td>
                        <td>{inventory.StockStatus}</td>
                        <td>{inventory.SupplierName}</td>
                        <td>{inventory.SupplierContact}</td>

                        <td className="">
                          <div className="flex">
                            <Link
                              to={`/admin/inventories/get/${inventory._id}`}
                              className="btn1"
                            >
                              <MdInfo className="text-2xl" />
                            </Link>
                            <Link
                              to={`/admin/inventories/update/${inventory._id}`}
                              className="btnU"
                            >
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
