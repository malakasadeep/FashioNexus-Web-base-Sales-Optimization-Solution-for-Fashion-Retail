import express from "express";

import {
  getInventories,
  getInventory,
  createInventory,
  deleteInventory,
  updateInventory,
  getInventorySearch,
  getInventorieswithOffers,
} from "../controllers/inventory.controller.js";

const router = express.Router();

//GET all inventories
router.get("/all-offers", getInventorieswithOffers);

//GET a single inventory
router.get("/:id", getInventory);

//POST a new inventory
router.post("/add", createInventory);

//DELETE an inventory
router.delete("/:id", deleteInventory);

//UPDATE an inventory
router.patch("/:id", updateInventory);

//SEARCH
router.get("/search/get", getInventorySearch);

export default router;
