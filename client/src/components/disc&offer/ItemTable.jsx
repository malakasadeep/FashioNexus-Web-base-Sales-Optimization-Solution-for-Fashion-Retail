// ItemTable.js
import React, { useState } from "react";
import AddDiscountPopup from "./AddDiscountPopup";
import items from "./items";

export default function ItemTable() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddDiscount = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-SecondaryColor p-8 rounded-lg shadow-md mb-10">
      <h2 className="text-2xl font-semibold text-DarkColor mb-4">
        Items for Discount
      </h2>
      <table className="min-w-full bg-PrimaryColor shadow-md rounded">
        <thead>
          <tr>
            <th className="p-4 text-left text-DarkColor">Image</th>
            <th className="p-4 text-left text-DarkColor">Name</th>
            <th className="p-4 text-left text-DarkColor">Price</th>
            <th className="p-4 text-left text-DarkColor">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="p-4">
                <img src={item.img} alt={item.name} className="w-20 rounded" />
              </td>
              <td className="p-4 text-DarkColor">{item.name}</td>
              <td className="p-4 text-DarkColor">${item.price}</td>
              <td className="p-4">
                <button
                  onClick={() => handleAddDiscount(item)}
                  className="bg-DarkColor text-white px-4 py-2 rounded hover:bg-ExtraDarkColor transition"
                >
                  Add Discount
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Discount Popup */}
      {isPopupOpen && selectedItem && (
        <AddDiscountPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onSave={(offer) => console.log("Offer saved:", offer)} // Replace with actual save logic
        />
      )}
    </div>
  );
}
