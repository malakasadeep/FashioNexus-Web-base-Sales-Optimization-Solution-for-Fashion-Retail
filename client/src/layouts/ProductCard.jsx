import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ id, img, name, price, discount }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/item/${id}`); // Navigate to the item details page
  };

  return (
    <div
      className="h-[420px] w-[370px] text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2 cursor-pointer"
      key={id}
      onClick={handleCardClick} // Add onClick handler
    >
      {/* Image container with fixed dimensions */}
      <div className="h-[250px] w-full">
        <img
          src={img}
          alt={name}
          className="h-full w-full object-cover rounded-t-xl" // Maintain aspect ratio while filling container
        />
      </div>

      {/* Card content */}
      <div className="p-4 flex flex-col justify-center items-center">
        <h1 className="font-semibold text-xl">{name}</h1>
        <div className="flex gap-10 pt-2">
          <h2 className="font-medium text-lg">${price}</h2>
          {discount && <h2 className="font-medium text-red-500">{discount}</h2>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-8 pt-4 items-center">
          <button className="bg-ExtraDarkColor text-white px-4 py-2 font-medium rounded active:bg-amber-800">
            Add to Cart
          </button>
          <div className="flex gap-1 items-center">
            <h2>5.0</h2>
            <FaStar className="text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
