import React, { useState, useEffect } from "react";
import DiscountTable from "./DiscountTable";

function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch discounts from the backend API
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch("/api/discount/get");
      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }
      const data = await response.json();
      setDiscounts(data); // Assuming the API returns an array of discount objects
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = (discount) => {
    // Logic to update discount
    console.log("Update discount:", discount);
  };

  const handleDeleteDiscount = async (id) => {
    try {
      const response = await fetch(`/api/discount/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDiscounts(discounts.filter((discount) => discount.id !== id));
        console.log("Discount deleted successfully.");
      } else {
        console.error("Failed to delete discount.");
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  const handleGoToItem = (itemId) => {
    // Logic to navigate to the item page
    console.log("Go to item:", itemId);
  };

  const handleGenerateReport = () => {
    // Logic to generate a report
    console.log("Generating report...");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Discounts</h1>
      {loading ? (
        <p>Loading discounts...</p>
      ) : (
        <DiscountTable
          discounts={discounts}
          onUpdate={handleUpdateDiscount}
          onDelete={handleDeleteDiscount}
          onGoToItem={handleGoToItem}
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
}

export default DiscountManager;
