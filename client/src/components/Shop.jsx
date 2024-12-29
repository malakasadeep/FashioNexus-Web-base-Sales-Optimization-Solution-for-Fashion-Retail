import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DiscountCard from "../layouts/DiscountCard";
import { FaSpinner } from "react-icons/fa";

export default function Shop() {
  const [itemsWithOffers, setItemsWithOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  // Function to fetch discounted items and their offers
  const fetchItemsWithOffers = async () => {
    try {
      setLoading(true);
      const inventoryResponse = await fetch("/api/inventories/all-offers");
      const inventoryItems = await inventoryResponse.json();

      const itemsWithOfferPromises = inventoryItems.map(async (item) => {
        const offerResponse = await fetch(`/api/promotions/offers/${item._id}`);
        const offerDetails = await offerResponse.json();
        return { ...item, offers: offerDetails };
      });

      const itemsWithOffers = await Promise.all(itemsWithOfferPromises);
      setItemsWithOffers(itemsWithOffers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch items with offers.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItemsWithOffers(); // Fetch data on component mount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-DarkColor text-5xl" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col justify-center lg:px-32 px-5 pt-14">
      {/* Heading Section */}
      <div className="mb-8">
        <h1 className="font-bold text-4xl text-center text-[#a98467]">
          Special Offers And Discounts For You
        </h1>
      </div>

      {/* Carousel Section */}
      <Slider {...settings}>
        {itemsWithOffers.map((item) => (
          <div key={item.id} className="px-3 mb-10 mt-5">
            {/* Add padding between slides */}
            <DiscountCard
              id={item._id}
              img={item.imageUrls[0]}
              name={item.ItemName}
              price={item.UnitPrice}
              description={item.description}
              stockCount={item.StockQuantity}
              sizes={item.Sizes}
              colors={item.Colors}
              offers={item.offers}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
