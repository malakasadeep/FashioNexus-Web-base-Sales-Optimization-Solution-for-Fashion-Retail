import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema({
  ItemName: {
    type: String,
    required: true,
  },
  SKU: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  StockQuantity: {
    type: Number,
    required: true,
  },
  ReorderLevel: {
    type: Number,
    required: true,
  },
  StockStatus: {
    type: String,
    required: true,
  },
  SupplierName: {
    type: String,
    required: true,
  },
  SupplierContact: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: Array,
    required: true,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
