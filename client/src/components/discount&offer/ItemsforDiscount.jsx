import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaSearch, FaTag } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdImageNotSupported } from "react-icons/md";
import { motion } from "framer-motion";

export default function ItemsforDiscount() {
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/inventories/search/get`
        );
        const data = await res.json();
        setInventories(data);
        setFilteredInventories(data); // Set initial filtered data
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
      setLoading(false);
    };

    fetchInventories();
  }, []);

  // Filter inventories based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = inventories.filter((inventory) =>
      inventory.ItemName.toLowerCase().includes(query)
    );
    setFilteredInventories(filtered);
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] px-6 py-8 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title Section */}
        <motion.div
          className=""
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-DarkColor flex items-center">
            Items for Discounts
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full max-w-sm">
            <motion.input
              type="text"
              placeholder="Search by Item Name"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-DarkColor"
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <FaSearch className="absolute top-2 right-3 text-gray-500" />
          </div>
        </motion.div>

        {/* Inventory List */}
        <motion.div
          className="list--container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading && (
            <div className="flex flex-col items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-5xl text-DarkColor" />
              <p className="text-lg w-full text-center mt-4">Loading...</p>
            </div>
          )}

          {!loading && filteredInventories.length === 0 && (
            <motion.p
              className="text-2xl text-center p-5 text-blue-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No Inventories Found
            </motion.p>
          )}

          {/* Table */}
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-DarkColor text-white">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Image</th>
                <th className="text-left px-4 py-3 font-semibold">Item Name</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.map((inventory, index) => (
                <motion.tr
                  key={inventory._id}
                  className="hover:bg-PrimaryColor transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <motion.td
                    className="text-left px-4 py-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {inventory.imageUrls ? (
                      <img
                        src={
                          inventory.imageUrls[inventory.imageUrls.length - 1]
                        }
                        alt={inventory.ItemName}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <MdImageNotSupported className="text-3xl text-gray-500" />
                    )}
                  </motion.td>
                  <td className="text-left px-4 py-4 font-medium text-gray-800">
                    {inventory.ItemName}
                  </td>
                  <td className="text-left px-4 py-4 text-gray-800">
                    ${inventory.UnitPrice}.00
                  </td>
                  <td className="text-left px-4 py-4">
                    <motion.button
                      onClick={() =>
                        navigate("/manager/add-discount", {
                          state: {
                            price: inventory.UnitPrice,
                            id: inventory._id,
                            name: inventory.ItemName,
                          },
                        })
                      }
                      className="bg-DarkColor text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-ExtraDarkColor transition-colors"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaTag />
                      Add Discount
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </>
  );
}
