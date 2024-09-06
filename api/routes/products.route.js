import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/products.controller.js";
const router = express.Router();

router.post("/add", addProduct);
router.get("/get", getAllProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);

export default router;
