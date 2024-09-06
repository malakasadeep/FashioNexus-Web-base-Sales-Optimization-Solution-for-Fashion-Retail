import express from "express";
import { addProduct } from "../controllers/products.controller.js";
const router = express.Router();

router.post("/add", addProduct);

export default router;
