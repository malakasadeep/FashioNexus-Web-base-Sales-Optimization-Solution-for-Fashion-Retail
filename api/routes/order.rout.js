import express from "express";
import {
  createOrder,
  deleteOrder,
  OrderByUser,
  updateOrder,
  updateStatus,
  AllOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/add", createOrder);
router.get("/get/:userId", OrderByUser);
router.get("/get", AllOrder);
router.put("/update/:orderId", updateOrder);
router.put("/status/:id", updateStatus);
router.delete("/delete/:orderId", deleteOrder);

export default router;
