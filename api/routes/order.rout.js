import express from "express";
import {
  createOrder,
  deleteOrder,
  OrderByUser,
  updateOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/add", createOrder);
router.get("/get/:userId", OrderByUser);
router.put("/update/:orderId", updateOrder);
router.delete("/delete/:orderId", deleteOrder);

export default router;
