import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const ViewItems = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products/get");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/delete/${id}`);
      Swal.fire("Deleted!", "The product has been deleted.", "success");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error!", "There was an error deleting the product.", "error");
    }
  };

  // Download report as CSV
  const downloadReport = () => {
    const csvContent = [
      [
        "Product Name",
        "Stock",
        "Unit Price",
        "Category",
        "Availability",
        "Available Sizes",
        "Available Colors",
        "Supplier Name",
        "Contact No",
        "Email",
        "Address",
        "Description",
      ],
      ...products.map((product) => [
        product.name,
        product.stock,
        product.unitPrice,
        product.category,
        product.availability,
        product.availableSizes.join(", "),
        product.availableColors.join(", "),
        product.supplierDetails.supplierName,
        product.supplierDetails.contactNo,
        product.supplierDetails.email,
        product.supplierDetails.address,
        product.description || "N/A",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "products_report.csv");
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredProducts);

  return (
    <div className="p-6 bg-[#f5ebe0] text-[#775c41]">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={downloadReport}
          className="bg-[#d4a373] text-white p-2 rounded hover:bg-[#a98467]"
        >
          Download Report
        </button>
      </div>

      <table className="w-full bg-[#e3d5ca] rounded-md">
        <thead>
          <tr className="text-left border-b-2 border-[#d4a373]">
            <th className="p-2">Image</th> {/* New column for image */}
            <th className="p-2">Product Name</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Unit Price</th>
            <th className="p-2">Category</th>
            <th className="p-2">Availability</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="border-b hover:bg-[#f5ebe0]">
              <td className="p-2">
                {product.images.length > 0 && (
                  <img
                    src={`http://localhost:3000/${product.images[0]}`} // Full URL to the image
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                )}
              </td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">${product.unitPrice.toFixed(2)}</td>
              <td className="p-2">{product.category}</td>
              <td className="p-2">{product.availability}</td>
              <td className="p-2">
                <button
                  onClick={() =>
                    Swal.fire({
                      title: product.name,
                      html: `
                      <strong>Supplier:</strong> ${
                        product.supplierDetails.supplierName
                      }<br />
                      <strong>Contact:</strong> ${
                        product.supplierDetails.contactNo
                      }<br />
                      <strong>Email:</strong> ${
                        product.supplierDetails.email
                      }<br />
                      <strong>Address:</strong> ${
                        product.supplierDetails.address
                      }<br />
                      <strong>Description:</strong> ${
                        product.description || "N/A"
                      }<br />
                      <strong>Sizes:</strong> ${product.availableSizes.join(
                        ", "
                      )}<br />
                      <strong>Colors:</strong> ${product.availableColors
                        .map(
                          (color) =>
                            `<span style="display:inline-block;width:20px;height:20px;background-color:${color};margin-right:5px;"></span>`
                        )
                        .join("")}
                    `,
                      confirmButtonText: "Close",
                    })
                  }
                  className="bg-[#d4a373] text-white px-2 py-1 rounded hover:bg-[#a98467] mr-2"
                >
                  View More
                </button>
                <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2">
                  Update
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewItems;
