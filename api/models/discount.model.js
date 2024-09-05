import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    itemId: { type: Number, required: true },
    title: { type: String, required: true },
    rate: { type: Number, required: true },
    period: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    conditions: { type: String, required: true },
    description: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    actualprice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
