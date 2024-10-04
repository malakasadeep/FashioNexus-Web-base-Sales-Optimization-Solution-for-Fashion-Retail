import mongoose from "mongoose";

const Schema = mongoose.Schema;

const promotionSchema = new Schema(
  {
    promotionName: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    promotionCode: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    promotionType: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    applicableProducts: {
      type: String,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Promotion = mongoose.model("Promotion&Discount", promotionSchema);

export default Promotion;
