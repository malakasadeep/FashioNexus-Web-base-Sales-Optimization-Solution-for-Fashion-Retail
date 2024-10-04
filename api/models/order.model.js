import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  items: [
    {
      itemId: {
        type: String,
        ref: "Item",
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      title: { type: String, required: true },
      color: { type: String },
      size: { type: String },
      img: { type: String, required: true },
    },
  ],
  total: { type: Number, required: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  deliveryInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ["Cash", "Card"], required: true },
  cardInfo: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
  },
  orderId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
