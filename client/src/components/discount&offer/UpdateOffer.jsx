import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiPercent, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calculateFinalPrice = (price, discountPercentage) => {
    if (price && discountPercentage) {
      return (price - (price * discountPercentage) / 100).toFixed(2);
    }
    return "";
  };

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/promotions/${id}`);
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
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Start date cannot be in the past.",
      });
      return;
    }

    if (endDate < today) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "End date cannot be in the past.",
      });
      return;
    }

    if (endDate < startDate) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "End date cannot be before the start date.",
      });
      return;
    }

    if (parseInt(formData.usageLimit, 10) <= 0) {
      setLoading(false);
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
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${json.message}`,
      });
      return;
    }

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

    setLoading(false);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Promotion updated successfully",
    });

    navigate("/manager/discount-management?tab=discounts");
  };

  return (
    <div className=" p-8 pl-20 ">
      <motion.div
        className="min-h-screen bg-gradient-to-r from-[#f5ebe0] to-[#e3d5ca] text-[#775c41] px-6 py-8 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex  items-center mb-6">
          {/* Back Button */}
          <button
            className="bg-DarkColor text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-ExtraDarkColor transition-colors"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="mr-2" />
          </button>
          <h2 className="text-3xl font-bold text-DarkColor ml-20">
            Update Offer
          </h2>
        </div>

        <motion.div
          className="flex  min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section className="bg-white p-6 rounded-lg shadow-md w-11/12">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10">
              {/* First Column */}
              <div className="space-y-10">
                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Offer Name</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="text"
                    placeholder="Offer Name"
                    name="promotionName"
                    value={formData.promotionName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Offer Code</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="text"
                    placeholder="Offer Code"
                    name="promotionCode"
                    value={formData.promotionCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Description</label>
                  <textarea
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Offer Type</label>
                  <select
                    name="promotionType"
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    onChange={handleInputChange}
                    value={formData.promotionType}
                  >
                    <option value="pDiscount">Percentage Discount</option>
                    <option value="BOGO">Buy One Get One Free</option>
                    <option value="fShipping">Free Shipping</option>
                    <option value="fGift">Free Gift</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold flex items-center">
                    Discount Percentage <FiPercent className="ml-2" />
                  </label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="text"
                    placeholder="Discount Percentage"
                    name="discountPercentage"
                    onChange={handleInputChange}
                    value={formData.discountPercentage}
                  />
                </div>
              </div>

              {/* Second Column */}
              <div className="space-y-10">
                <div className="flex flex-col">
                  <label className="text-1xl font-semibold flex items-center">
                    Price <FiDollarSign className="ml-2" />
                  </label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="text"
                    placeholder="Price"
                    name="price"
                    onChange={handleInputChange}
                    value={formData.price}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Final Price</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="text"
                    placeholder="Final Price"
                    name="finalPrice"
                    value={formData.finalPrice}
                    readOnly
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Start Date</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="date"
                    name="startDate"
                    onChange={handleInputChange}
                    value={formData.startDate}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">End Date</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="date"
                    name="endDate"
                    onChange={handleInputChange}
                    value={formData.endDate}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-1xl font-semibold">Usage Limit</label>
                  <input
                    className="mt-2 p-2 border-spacing-1 rounded-lg border"
                    type="number"
                    placeholder="Usage Limit"
                    name="usageLimit"
                    onChange={handleInputChange}
                    value={formData.usageLimit}
                  />
                </div>

                <button
                  type="submit"
                  className=" bg-rose-400 p-3 rounded-lg font-bold text-xl w-full flex justify-center items-center"
                >
                  {loading ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    "Update Offer"
                  )}
                </button>
              </div>

              {error && <div className="error text-red-600 mt-4">{error}</div>}
            </form>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
}
