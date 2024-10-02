import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MdInfo } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import PromotionReport from "./PromotionReport";

function DiscountTable() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("category") || "all";
    const sort = urlParams.get("sort") || "created_at";
    const order = urlParams.get("order") || "desc";
    setSearchData({ searchTerm, type, sort, order });

    const fetchPromotions = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(
          `http://localhost:3000/api/promotions/search/get?${searchQuery}`
        );
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.type === "select-one") {
      setSearchData({ ...searchData, type: e.target.value });
    }
    if (e.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("type", searchData.type);
    const searchQuery = urlParams.toString();
    navigate(`/manager/discount-management?${searchQuery}`);
  };

  const handleDelete = async (promotionId) => {
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
          const res = await fetch(`/api/promotions/${promotionId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          Swal.fire({
            title: "Deleted!",
            text: "The promotion has been deleted.",
            icon: "success",
          });
          setPromotions((prev) =>
            prev.filter((promotion) => promotion._id !== promotionId)
          );
          // navigate("/manager/discount-management");
        } catch (error) {
          console.log(error.message);
        }
      }
    });
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
              <h1 className="text-2xl font-semibold">Existing Discounts</h1>
            </div>
            <br />
            <div className="search--line flex items-center justify-between flex-wrap gap-5">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleChange}
                  id="searchTerm"
                  className="border p-3 rounded-lg"
                />
                <select
                  className="border border-zinc-950 p-3 rounded-lg bg-slate-200"
                  name="category"
                  id="category"
                  required
                  onChange={handleChange}
                >
                  <option className="text-slate-400" hidden>
                    Type
                  </option>
                  <option value="pDiscount">Percentage Discount</option>
                  <option value="BOGO">Buy One Get One Free</option>
                  <option value="fShipping">Free Shipping</option>
                  <option value="fGift">Free Gift</option>
                </select>
              </div>

              <div className="flex items-center gap-5 ">
                <button className="border border-zinc-950 ">
                  <PromotionReport
                    promotions={promotions}
                    searchData={searchData}
                  />
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-transparent hover:bg-blue-500 text-blue-900 font-semibold text-2xl hover:text-white border border-blue-900 hover:border-transparent rounded px-10"
                >
                  Search
                </button>

                <button
                  className="bg-DarkColor text-white p-2 rounded hover:bg-ExtraDarkColor transition"
                  onClick={() => navigate("add")}
                >
                  Add Promotion
                </button>
              </div>
            </div>

            <div className="list--container">
              {!loading && promotions.length === 0 && (
                <p className="text-2xl text-center p-5 text-blue-950">
                  No Promotions found
                </p>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg w-full text-center">Loading....</p>
                </div>
              )}
              {!loading && promotions.length > 0 && (
                <table className="list">
                  <tbody>
                    <tr className="font-semibold text-blue-900 text-lg text-center p-4">
                      <td className="px-8">Promotion Name</td>
                      <td className="px-8">Promotion Code</td>
                      <td className="px-8">Discount %</td>
                      <td className="px-8">Price</td>
                      <td className="px-8">Final Price</td>
                      <td className="px-8">Start Date</td>
                      <td className="px-8">End Date</td>
                      <td className="px-8">Action</td>
                    </tr>
                    {promotions.map((promotion) => (
                      <tr className="text-center" key={promotion._id}>
                        <td className="py-4">{promotion.promotionName}</td>
                        <td className="py-4">{promotion.promotionCode}</td>
                        <td className="py-4">{promotion.discountPercentage}</td>
                        <td className="py-4">{promotion.price}</td>
                        <td className="py-4">
                          {promotion.finalPrice || "N/A"}
                        </td>
                        <td className="py-4">{promotion.startDate}</td>
                        <td>{promotion.endDate}</td>

                        <td className="">
                          <div className="flex">
                            <button
                              className="btn1 px-2"
                              onClick={() => handleInfo(promotion)}
                            >
                              <MdInfo className="text-2xl" />
                            </button>

                            <Link
                              to={`update/${promotion._id}`}
                              className="btnU px-2"
                            >
                              <FaEdit className="text-2xl" />
                            </Link>

                            <button
                              className="btnD px-2"
                              onClick={(e) => handleDelete(promotion._id)}
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

export default DiscountTable;
