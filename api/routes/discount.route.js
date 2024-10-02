import express from "express";
import {
  createDiscount,
  deleteDiscounts,
  getDiscounts,
  updateDiscounts,
} from "../controllers/discount.controller.js";

const router = express.Router();

router.post("/add", createDiscount);
router.get("/get", getDiscounts);
router.put("/update/:id", updateDiscounts);
router.delete("/delete/:id", deleteDiscounts);

export default router;
