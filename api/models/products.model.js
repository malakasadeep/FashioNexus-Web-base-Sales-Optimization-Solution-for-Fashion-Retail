import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true },
    addedDate: { type: Date, required: true },
    category: { type: String, required: true },
    availableSizes: [String],
    availableColors: [String],
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      required: true,
    },
    images: [String],
    supplierDetails: {
      supplierName: { type: String, required: true },
      contactNo: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    ofeer: { type: Boolean, required: true, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", productSchema);

export default Products;
