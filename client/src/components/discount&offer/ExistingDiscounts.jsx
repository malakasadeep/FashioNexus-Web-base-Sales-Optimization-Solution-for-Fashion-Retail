import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdInfo,
  MdDeleteForever,
  MdSearch,
  MdSort,
  MdFileDownload,
} from "react-icons/md";
import { FaEdit, FaFilter, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import PromotionReport from "./PromotionReport";

function DiscountTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const sort = urlParams.get("sort") || "created_at";
    const order = urlParams.get("order") || "desc";
    setSearchData({ searchTerm, type, sort, order });

    const fetchPromotions = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/promotions/search/get?${searchQuery}`);
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch promotions. Please try again later.",
        });
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [location.search]);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchData);
    navigate(`/manager/discount-management?${urlParams.toString()}`);
  };

  const handleDelete = async (promotionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4a373",
      cancelButtonColor: "#a98467",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/promotions/${promotionId}`, {
          method: "DELETE",
        });

        // Check if response is not OK
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // Check if response contains success key
        if (res.status === 200) {
          Swal.fire("Deleted!", "The promotion has been deleted.", "success");
          setPromotions((prev) =>
            prev.filter((promotion) => promotion._id !== promotionId)
          );
        } else {
          Swal.fire("Error!", data.message || "Unknown error", "error");
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        Swal.fire(
          "Error!",
          "Failed to delete the promotion. Please try again.",
          "error"
        );
      }
    }
  };

  const handleInfo = (promotion) => {
    Swal.fire({
      title: promotion.promotionName,
      html: `
        <strong>Type:</strong> ${promotion.promotionType}<br/>
        <strong>Description:</strong> ${promotion.description}<br/>
        <strong>Applicable Products:</strong> ${promotion.applicableProducts}<br/>
        <strong>Usage Limit:</strong> ${promotion.usageLimit}
      `,
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#d4a373",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] p-8 rounded-lg"
    >
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-DarkColor mb-8">
          Discount Management
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  placeholder="Search promotions..."
                  value={searchData.searchTerm}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg border border-DarkColor focus:outline-none focus:ring-2 focus:ring-DarkColor"
                />
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-DarkColor text-xl" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                name="type"
                value={searchData.type}
                onChange={handleChange}
                className="p-3 rounded-lg border border-DarkColor focus:outline-none focus:ring-2 focus:ring-DarkColor"
              >
                <option value="all">All Types</option>
                <option value="pDiscount">Percentage Discount</option>
                <option value="BOGO">Buy One Get One Free</option>
                <option value="fShipping">Free Shipping</option>
                <option value="fGift">Free Gift</option>
              </select>
              <button
                type="submit"
                className="bg-DarkColor text-white p-3 rounded-lg hover:bg-ExtraDarkColor transition duration-300 flex items-center gap-2"
              >
                <FaFilter /> Filter
              </button>
              <PromotionReport
                promotions={promotions}
                searchData={searchData}
                render={({ onClick }) => (
                  <button
                    onClick={onClick}
                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center gap-2"
                  >
                    <MdFileDownload /> Download Report
                  </button>
                )}
              />
            </div>
          </div>
        </form>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <FaSpinner className="animate-spin text-DarkColor text-5xl" />
            </motion.div>
          ) : promotions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-DarkColor text-white">
                    <th className="p-3 text-left">Promotion Name</th>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Discount %</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Final Price</th>
                    <th className="p-3 text-left">Start Date</th>
                    <th className="p-3 text-left">End Date</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <motion.tr
                      key={promotion._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-DarkColor bg-white hover:bg-SecondaryColor transition duration-300"
                    >
                      <td className="p-3">{promotion.promotionName}</td>
                      <td className="p-3">{promotion.promotionCode}</td>
                      <td className="p-3">{promotion.discountPercentage}%</td>
                      <td className="p-3">${promotion.price}</td>
                      <td className="p-3">${promotion.finalPrice || "N/A"}</td>
                      <td className="p-3">
                        {new Date(promotion.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInfo(promotion)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                          >
                            <MdInfo />
                          </button>
                          <Link
                            to={`/manager/update-discount/${promotion._id}`}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(promotion._id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-lg text-DarkColor"
            >
              No promotions found.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default DiscountTable;
