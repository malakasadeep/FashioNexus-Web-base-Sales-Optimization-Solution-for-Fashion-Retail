import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateOffer() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    promotionName: "",
    promotionCode: "",
    description: "",
    promotionType: "",
    discountPercentage: "",
    price: "",
    finalPrice: "",
    startDate: "",
    endDate: "",
    applicableProducts: "",
    usageLimit: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //const { offerID } = useParams();

  const calculateFinalPrice = (price, discountPercentage) => {
    if (price && discountPercentage) {
      return (price - (price * discountPercentage) / 100).toFixed(2);
    }
    return "";
  };

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/promotions/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch offer details");
        }
        setFormData({
          promotionName: data.promotionName || "",
          promotionCode: data.promotionCode || "",
          description: data.description || "",
          promotionType: data.promotionType || "Percentage Discount",
          discountPercentage: data.discountPercentage || "",
          price: data.price || "",
          finalPrice: data.finalPrice || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          applicableProducts: data.applicableProducts || "",
          usageLimit: data.usageLimit || "",
        });
      } catch (error) {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${error.message}`,
        });
      }
    };
    fetchOffer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "discountPercentage" || name === "price") {
      // Validate number input
      if (/^\d*$/.test(value)) {
        const updatedFormData = { ...formData, [name]: value };
        const finalPrice = calculateFinalPrice(
          updatedFormData.price,
          updatedFormData.discountPercentage
        );
        setFormData({ ...updatedFormData, finalPrice });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: `${
            name === "discountPercentage" ? "Discount Percentage" : "Price"
          } should only contain numbers.`,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Start date cannot be in the past.",
      });
      return;
    }

    if (endDate < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "End date cannot be in the past.",
      });
      return;
    }

    if (endDate < startDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "End date cannot be before the start date.",
      });
      return;
    }

    if (parseInt(formData.usageLimit, 10) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Usage Limit cannot be zero or negative.",
      });
      return;
    }

    const response = await fetch(`/api/promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...formData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${data.message}`,
      });
      return;
    }
    if (response.ok) {
      setFormData({
        promotionName: "",
        promotionCode: "",
        description: "",
        promotionType: "Percentage Discount",
        discountPercentage: "",
        price: "",
        finalPrice: "",
        startDate: "",
        endDate: "",
        applicableProducts: "",
        usageLimit: "",
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Promotion updated successfully",
      });
      navigate("/manager/discount-management");
    }
  };

  return (
    <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-DarkColor mb-4 text-center">
        Update the Offer
      </h2>

      <div className="flex justify-center items-center min-h-screen">
        <section className="bg-orange-100	p-6 rounded-lg shadow-md w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Offer Name
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="text"
                placeholder="Offer Name"
                name="promotionName"
                value={formData.promotionName}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Offer Code
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="text"
                placeholder="Offer Code"
                name="promotionCode"
                value={formData.promotionCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Description
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="textarea"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                name="description"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="type" className="text-1xl font-semibold">
                Offer Type
              </label>
              <select
                name="promotionType"
                id="type"
                className="mt-2 p-2 border-spacing-1"
                onChange={handleInputChange}
                value={formData.promotionType}
              >
                <option value="pDiscount">Percentage Discount</option>
                <option value="BOGO">Buy One Get One Free</option>
                <option value="fShipping">Free Shipping</option>
                <option value="fGift">Free Gift</option>
              </select>
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Discount Percentage
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="text"
                placeholder="Discount Percentage"
                name="discountPercentage"
                onChange={handleInputChange}
                value={formData.discountPercentage}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Price
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="text"
                placeholder="Price"
                name="price"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Final Price
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="text"
                placeholder="Final Price"
                name="finalPrice"
                value={formData.finalPrice}
                readOnly
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Start Date
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="date"
                placeholder="dd-mm-yyyy"
                name="startDate"
                onChange={handleInputChange}
                value={formData.startDate}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                End Date
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="date"
                placeholder="dd-mm-yyyy"
                name="endDate"
                onChange={handleInputChange}
                value={formData.endDate}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="type" className="text-1xl font-semibold">
                Applicable Products
              </label>
              <select
                name="applicableProducts"
                id="type"
                className="mt-2 p-2 border-spacing-1"
                onChange={handleInputChange}
                value={formData.applicableProducts}
              >
                <option value="apparel">Apparel</option>
                <option value="outerwear">Outerwear</option>
                <option value="kidsclothing">Children's Clothing</option>
                <option value="formalwear">Formal Wear</option>
              </select>
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="" className="text-1xl font-semibold">
                Usage Limit
              </label>
              <input
                className="mt-2 p-2 border-spacing-1"
                type="number"
                placeholder="Usage Limit"
                name="usageLimit"
                onChange={handleInputChange}
                value={formData.usageLimit}
              />
            </div>

            <div className="flex justify-center mb-4">
              <button
                type="submit"
                className="bg-rose-400 p-2 rounded-lg w-full max-w-xs font-bold text-xl align-middle"
              >
                Update Offer
              </button>
            </div>

            {error && <div className="error">{error}</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
