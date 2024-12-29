import React, { useEffect, useState } from "react";
import ProductCard from "../layouts/ProductCard";
import { FaSpinner } from "react-icons/fa";

export default function Products() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/inventories/search/get`);
        const data = await res.json();
        setInventories(data);
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
      setLoading(false);
    };

    fetchInventories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center px-5 pt-24 lg:pt-16">
      {/* heading section */}
      <div>
        <h1 className="font-semibold text-4xl text-center text-ExtraDarkColor">
          New Arrivals
        </h1>
      </div>

      {/* Cards section */}
      <div className="flex flex-wrap justify-center gap-5 pt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-DarkColor text-5xl" />
          </div>
        ) : (
          inventories.map((inventory) => (
            <ProductCard
              key={inventory._id}
              id={inventory._id}
              img={
                inventory.imageUrls?.[inventory.imageUrls.length - 1] ||
                "/default-img.jpg"
              }
              name={inventory.ItemName}
              price={inventory.UnitPrice}
              discount={
                inventory.Discount ? `${inventory.Discount}% Off` : null
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
