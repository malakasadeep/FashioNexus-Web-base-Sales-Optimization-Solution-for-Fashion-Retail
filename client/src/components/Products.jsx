// import React from "react";
// import ProductCard from "../layouts/ProductCard";

// export default function Products() {
//   const data = [
//     {
//       id: 12,
//       img: "/src/assets/img/product13.jpg",
//       name: "Canvas Sneakers",
//       price: "298.00",
//       discount: "28% Off",
//     },
//     {
//       id: 13,
//       img: "/src/assets/img/product14.jpg",
//       name: "shirt combo pack ",
//       price: "199.00",
//       discount: "40% Off",
//     },
//     {
//       id: 14,
//       img: "/src/assets/img/product15.jpg",
//       name: "Hublot watch",
//       price: "198.00",
//       discount: "26% Off",
//     },
//   ];

//   return (
//     <div className=" min-h-screen flex flex-col justify-center px-5 pt-24 lg:pt-16">
//       {/* heading section */}
//       <div>
//         <h1 className=" font-semibold text-4xl text-center text-ExtraDarkColor">
//           New Arrivals
//         </h1>
//       </div>

//       {/* Cards section */}
//       <div className=" flex flex-wrap justify-center gap-5 pt-8">
//         {data.map((item) => (
//           <ProductCard
//             key={item.id}
//             id={item.id}
//             img={item.img}
//             name={item.name}
//             price={item.price}
//             discount={item.discount}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import ProductCard from "../layouts/ProductCard";

export default function Products() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/inventories/search/get`);
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
    <div className=" min-h-screen flex flex-col justify-center px-5 pt-24 lg:pt-16">
      {/* heading section */}
      <div>
        <h1 className=" font-semibold text-4xl text-center text-ExtraDarkColor">
          New Arrivals
        </h1>
      </div>

      {/* Cards section */}
      <div className="flex flex-wrap justify-center gap-5 pt-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          inventories.map((inventory) => (
            <ProductCard
              key={inventory._id}
              id={inventory._id}
              img={inventory.imageUrls?.[inventory.imageUrls.length - 1] || '/default-img.jpg'}
              name={inventory.ItemName}
              price={inventory.UnitPrice}
              discount={inventory.Discount ? `${inventory.Discount}% Off` : null}
            />
          ))
        )}
      </div>
    </div>
  );
}
