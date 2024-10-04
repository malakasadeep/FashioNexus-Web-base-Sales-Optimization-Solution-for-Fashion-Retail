import express from "express";

import Promotion from "../models/promotion.model.js";

import {
  createPromotion,
  getPromotions,
  getPromotion,
  deletePromotion,
  updatePromotion,
  getPromotionSearch,
} from "../controllers/promotion.controllers.js";

const router = express.Router();

//Get all promotion
router.get("/", getPromotions);

//GET a single promotion
router.get("/:id", getPromotion);

//POST a new promotion
router.post("/", createPromotion);

//DELETE a promotion
router.delete("/:id", deletePromotion);

//UPDATE a promotion
router.patch("/:id", updatePromotion);

//SEARCH
router.get("/search/get", getPromotionSearch);

export default router;
